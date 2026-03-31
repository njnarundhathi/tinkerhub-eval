const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const cors = require('cors');
const crypto = require('crypto');
const { Readable } = require('stream');
const db = require('./db');

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function parseCSVBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const results = [];
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

function normalizeRow(row) {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    out[k.toLowerCase().trim().replace(/[\s\-]+/g, '_')] = typeof v === 'string' ? v.trim() : v;
  }
  return out;
}

function recalcAvgAndConflict(appId) {
  const app = db.prepare('SELECT * FROM applications WHERE id = ?').get(appId);
  const scores = [app.review1_score, app.review2_score, app.review3_score].filter(s => s != null);
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

  let conflictFlag = app.conflict_flag;
  let reviewer3Id = app.reviewer3_id;

  if (app.review1_score != null && app.review2_score != null && !app.reviewer3_id) {
    if (Math.abs(app.review1_score - app.review2_score) >= 4) {
      conflictFlag = 1;
      const juryReviewers = db.prepare("SELECT * FROM reviewers WHERE role = 'jury'").all();
      const eligible = shuffle(
        juryReviewers.filter(r =>
          (r.campus_name || '').toLowerCase() !== (app.campus_name || '').toLowerCase() &&
          r.id !== app.reviewer1_id &&
          r.id !== app.reviewer2_id
        )
      );
      if (eligible.length) reviewer3Id = eligible[0].id;
    }
  }

  db.prepare('UPDATE applications SET average_score = ?, conflict_flag = ?, reviewer3_id = ? WHERE id = ?')
    .run(avg, conflictFlag, reviewer3Id, appId);

  return { average_score: avg, conflict_flag: conflictFlag, conflict_detected: conflictFlag && !app.conflict_flag };
}

// ─── Auth Middleware ──────────────────────────────────────────────────────────

function authMiddleware(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  const session = db.prepare(`
    SELECT r.id, r.reviewer_id, r.name, r.email, r.campus_name, r.role
    FROM sessions s
    JOIN reviewers r ON s.reviewer_id = r.id
    WHERE s.token = ?
  `).get(token);

  if (!session) return res.status(401).json({ error: 'Invalid or expired session' });
  req.user = session;
  next();
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}

// ─── Auth Routes ─────────────────────────────────────────────────────────────

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body || {};
  if (!email?.trim()) return res.status(400).json({ error: 'Email is required' });

  const reviewer = db.prepare('SELECT * FROM reviewers WHERE LOWER(email) = LOWER(?)').get(email.trim());
  if (!reviewer) return res.status(401).json({ error: 'Email not found. Contact your administrator.' });

  const token = crypto.randomBytes(32).toString('hex');
  db.prepare('INSERT INTO sessions (token, reviewer_id) VALUES (?, ?)').run(token, reviewer.id);

  const { id, reviewer_id, name, email: userEmail, campus_name, role } = reviewer;
  res.json({ token, user: { id, reviewer_id, name, email: userEmail, campus_name, role } });
});

app.post('/api/auth/logout', authMiddleware, (req, res) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  res.json({ success: true });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const { id, reviewer_id, name, email, campus_name, role } = req.user;
  res.json({ id, reviewer_id, name, email, campus_name, role });
});

// ─── Admin: CSV Uploads ───────────────────────────────────────────────────────

app.post('/api/admin/upload/jury', authMiddleware, adminOnly, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const rows = await parseCSVBuffer(req.file.buffer);
    if (!rows.length) return res.status(400).json({ error: 'CSV file is empty' });

    const stmt = db.prepare(`
      INSERT INTO reviewers (reviewer_id, name, email, campus_name, role)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        reviewer_id = excluded.reviewer_id,
        name = excluded.name,
        campus_name = excluded.campus_name,
        role = excluded.role
    `);

    let inserted = 0;
    const errors = [];
    const insertAll = db.transaction((rows) => {
      for (const row of rows) {
        const r = normalizeRow(row);
        if (!r.email) { errors.push(`Row missing email: ${JSON.stringify(row)}`); continue; }
        if (!r.name) { errors.push(`Row missing name: ${JSON.stringify(row)}`); continue; }
        const rid = r.reviewer_id || `r-${Date.now()}-${inserted}`;
        stmt.run(rid, r.name, r.email, r.campus_name || null, r.role === 'admin' ? 'admin' : 'jury');
        inserted++;
      }
    });
    insertAll(rows);

    res.json({ success: true, inserted, errors: errors.slice(0, 10) });
  } catch (e) {
    res.status(400).json({ error: `Failed to parse CSV: ${e.message}` });
  }
});

app.post('/api/admin/upload/applications', authMiddleware, adminOnly, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const rows = await parseCSVBuffer(req.file.buffer);
    if (!rows.length) return res.status(400).json({ error: 'CSV file is empty' });

    const stmt = db.prepare(`
      INSERT INTO applications (
        application_id, name, campus_name, institution_name, email,
        github, portfolio, linkedin, graduation_year, answers, video_link
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(application_id) DO UPDATE SET
        name = excluded.name,
        campus_name = excluded.campus_name,
        institution_name = excluded.institution_name,
        email = excluded.email,
        github = excluded.github,
        portfolio = excluded.portfolio,
        linkedin = excluded.linkedin,
        graduation_year = excluded.graduation_year,
        answers = excluded.answers,
        video_link = excluded.video_link
    `);

    let inserted = 0;
    const errors = [];
    const insertAll = db.transaction((rows) => {
      for (const row of rows) {
        const r = normalizeRow(row);
        if (!r.application_id) { errors.push(`Row missing application_id`); continue; }
        stmt.run(
          r.application_id, r.name || null, r.campus_name || null,
          r.institution_name || null, r.email || null,
          r.github || null, r.portfolio || null, r.linkedin || null,
          r.graduation_year || null, r.answers || null, r.video_link || null
        );
        inserted++;
      }
    });
    insertAll(rows);

    res.json({ success: true, inserted, errors: errors.slice(0, 10) });
  } catch (e) {
    res.status(400).json({ error: `Failed to parse CSV: ${e.message}` });
  }
});

// ─── Admin: Assignment ────────────────────────────────────────────────────────

app.post('/api/admin/assign', authMiddleware, adminOnly, (req, res) => {
  const unassigned = db.prepare('SELECT * FROM applications WHERE reviewer1_id IS NULL').all();
  const juryReviewers = db.prepare("SELECT * FROM reviewers WHERE role = 'jury'").all();

  let assigned = 0, needsManual = 0;
  const stmt = db.prepare(
    'UPDATE applications SET reviewer1_id = ?, reviewer2_id = ?, needs_manual_assignment = ? WHERE id = ?'
  );

  db.transaction(() => {
    for (const app of unassigned) {
      const eligible = shuffle(
        juryReviewers.filter(r =>
          (r.campus_name || '').toLowerCase() !== (app.campus_name || '').toLowerCase()
        )
      );
      if (eligible.length >= 2) {
        stmt.run(eligible[0].id, eligible[1].id, 0, app.id);
        assigned++;
      } else {
        stmt.run(eligible[0]?.id ?? null, eligible[1]?.id ?? null, 1, app.id);
        needsManual++;
      }
    }
  })();

  res.json({ success: true, assigned, needsManual, skipped: 0, total: unassigned.length });
});

app.post('/api/admin/reassign', authMiddleware, adminOnly, (req, res) => {
  db.prepare(`UPDATE applications SET
    reviewer1_id = NULL, reviewer2_id = NULL, reviewer3_id = NULL,
    needs_manual_assignment = 0
  `).run();

  const all = db.prepare('SELECT * FROM applications').all();
  const juryReviewers = db.prepare("SELECT * FROM reviewers WHERE role = 'jury'").all();

  let assigned = 0, needsManual = 0;
  const stmt = db.prepare(
    'UPDATE applications SET reviewer1_id = ?, reviewer2_id = ?, needs_manual_assignment = ? WHERE id = ?'
  );

  db.transaction(() => {
    for (const app of all) {
      const eligible = shuffle(
        juryReviewers.filter(r =>
          (r.campus_name || '').toLowerCase() !== (app.campus_name || '').toLowerCase()
        )
      );
      if (eligible.length >= 2) {
        stmt.run(eligible[0].id, eligible[1].id, 0, app.id);
        assigned++;
      } else {
        stmt.run(eligible[0]?.id ?? null, eligible[1]?.id ?? null, 1, app.id);
        needsManual++;
      }
    }
  })();

  res.json({ success: true, assigned, needsManual, total: all.length });
});

// ─── Admin: Dashboard Data ────────────────────────────────────────────────────

app.get('/api/admin/applications', authMiddleware, adminOnly, (req, res) => {
  const { campus, min_score, max_score } = req.query;

  let sql = `
    SELECT a.*,
      r1.name AS reviewer1_name, r1.email AS reviewer1_email,
      r2.name AS reviewer2_name, r2.email AS reviewer2_email,
      r3.name AS reviewer3_name, r3.email AS reviewer3_email
    FROM applications a
    LEFT JOIN reviewers r1 ON a.reviewer1_id = r1.id
    LEFT JOIN reviewers r2 ON a.reviewer2_id = r2.id
    LEFT JOIN reviewers r3 ON a.reviewer3_id = r3.id
    WHERE 1=1
  `;
  const params = [];

  if (campus) { sql += ' AND LOWER(a.campus_name) = LOWER(?)'; params.push(campus); }
  if (min_score) { sql += ' AND a.average_score >= ?'; params.push(parseFloat(min_score)); }
  if (max_score) { sql += ' AND a.average_score <= ?'; params.push(parseFloat(max_score)); }

  sql += ' ORDER BY a.campus_name COLLATE NOCASE, a.average_score DESC';

  res.json(db.prepare(sql).all(...params));
});

app.get('/api/admin/campuses', authMiddleware, adminOnly, (req, res) => {
  const rows = db.prepare(
    'SELECT DISTINCT campus_name FROM applications WHERE campus_name IS NOT NULL ORDER BY campus_name COLLATE NOCASE'
  ).all();
  res.json(rows.map(r => r.campus_name));
});

app.get('/api/admin/stats', authMiddleware, adminOnly, (req, res) => {
  const stats = db.prepare(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN reviewer1_id IS NOT NULL AND reviewer2_id IS NOT NULL THEN 1 ELSE 0 END) AS assigned,
      SUM(CASE WHEN review1_score IS NOT NULL OR review2_score IS NOT NULL THEN 1 ELSE 0 END) AS partially_reviewed,
      SUM(CASE WHEN review1_score IS NOT NULL AND review2_score IS NOT NULL THEN 1 ELSE 0 END) AS fully_reviewed,
      SUM(CASE WHEN conflict_flag = 1 THEN 1 ELSE 0 END) AS conflicts,
      SUM(CASE WHEN needs_manual_assignment = 1 THEN 1 ELSE 0 END) AS needs_manual
    FROM applications
  `).get();

  const reviewerCount = db.prepare("SELECT COUNT(*) AS count FROM reviewers WHERE role = 'jury'").get().count;

  res.json({ ...stats, reviewer_count: reviewerCount });
});

app.post('/api/admin/resolve-conflict/:id', authMiddleware, adminOnly, (req, res) => {
  const app = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found' });
  if (!app.conflict_flag) return res.status(400).json({ error: 'No conflict on this application' });

  const juryReviewers = db.prepare("SELECT * FROM reviewers WHERE role = 'jury'").all();
  const eligible = shuffle(
    juryReviewers.filter(r =>
      (r.campus_name || '').toLowerCase() !== (app.campus_name || '').toLowerCase() &&
      r.id !== app.reviewer1_id &&
      r.id !== app.reviewer2_id
    )
  );

  if (!eligible.length) return res.status(400).json({ error: 'No eligible reviewers for 3rd assignment' });

  db.prepare('UPDATE applications SET reviewer3_id = ? WHERE id = ?').run(eligible[0].id, app.id);
  res.json({ success: true, reviewer: { name: eligible[0].name, email: eligible[0].email } });
});

// ─── Jury Routes ──────────────────────────────────────────────────────────────

app.get('/api/jury/applications', authMiddleware, (req, res) => {
  const uid = req.user.id;
  const apps = db.prepare(`
    SELECT a.id, a.application_id, a.name, a.campus_name, a.institution_name,
           a.review1_score, a.review2_score, a.review3_score, a.average_score, a.conflict_flag,
           CASE WHEN a.reviewer1_id = ? THEN 1
                WHEN a.reviewer2_id = ? THEN 2
                WHEN a.reviewer3_id = ? THEN 3
           END AS reviewer_slot
    FROM applications a
    WHERE a.reviewer1_id = ? OR a.reviewer2_id = ? OR a.reviewer3_id = ?
    ORDER BY a.campus_name COLLATE NOCASE, a.name COLLATE NOCASE
  `).all(uid, uid, uid, uid, uid, uid);

  const enriched = apps.map(app => ({
    ...app,
    has_reviewed: (
      (app.reviewer_slot === 1 && app.review1_score != null) ||
      (app.reviewer_slot === 2 && app.review2_score != null) ||
      (app.reviewer_slot === 3 && app.review3_score != null)
    )
  }));

  res.json(enriched);
});

app.get('/api/jury/applications/:id', authMiddleware, (req, res) => {
  const uid = req.user.id;
  const app = db.prepare(`
    SELECT a.*,
           CASE WHEN a.reviewer1_id = ? THEN 1
                WHEN a.reviewer2_id = ? THEN 2
                WHEN a.reviewer3_id = ? THEN 3
           END AS reviewer_slot
    FROM applications a
    WHERE a.id = ? AND (a.reviewer1_id = ? OR a.reviewer2_id = ? OR a.reviewer3_id = ?)
  `).get(uid, uid, uid, req.params.id, uid, uid, uid);

  if (!app) return res.status(404).json({ error: 'Application not found or not assigned to you' });
  res.json(app);
});

app.post('/api/jury/applications/:id/review', authMiddleware, (req, res) => {
  const uid = req.user.id;
  const score = parseInt(req.body?.score);
  const comment = (req.body?.comment || '').trim();

  if (!score || score < 1 || score > 10) return res.status(400).json({ error: 'Score must be between 1 and 10' });
  if (!comment) return res.status(400).json({ error: 'Comment is required' });

  const app = db.prepare(`
    SELECT *,
           CASE WHEN reviewer1_id = ? THEN 1
                WHEN reviewer2_id = ? THEN 2
                WHEN reviewer3_id = ? THEN 3
           END AS reviewer_slot
    FROM applications WHERE id = ?
  `).get(uid, uid, uid, req.params.id);

  if (!app || !app.reviewer_slot) return res.status(403).json({ error: 'Not assigned to this application' });

  const slot = app.reviewer_slot;
  if (app[`review${slot}_score`] != null) {
    return res.status(400).json({ error: 'You have already submitted a review for this application' });
  }

  db.prepare(`UPDATE applications SET review${slot}_score = ?, review${slot}_comment = ? WHERE id = ?`)
    .run(score, comment, app.id);

  const result = recalcAvgAndConflict(app.id);
  res.json({ success: true, ...result });
});

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`\nEval Platform server running on http://localhost:${PORT}\n`);
});
