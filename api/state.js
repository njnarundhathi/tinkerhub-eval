// ════════════════════════════════════════════════════════════════
// TinkerHub Evaluation — Shared State API (backed by Airtable)
// ════════════════════════════════════════════════════════════════
//
// One-time Airtable setup (takes ~1 minute):
//   1. Open your Airtable base (appdFV7VvqOIlQ36v)
//   2. Create a new table called exactly:  Eval Config
//   3. Add one field called:  Config  (type: Long text)
//   4. Leave the table empty — the API creates the first record automatically
//
// No new env vars needed — uses the same AIRTABLE_PAT and
// AIRTABLE_BASE_ID you already set in Vercel.
// ════════════════════════════════════════════════════════════════

const BASE_ID = process.env.AIRTABLE_BASE_ID || 'appdFV7VvqOIlQ36v';
const PAT     = process.env.AIRTABLE_PAT;

// Use the table name (URL-encoded) — safer than the table ID here
const TABLE   = 'Eval%20Config';
const AT_URL  = `https://api.airtable.com/v0/${BASE_ID}/${TABLE}`;

const headers = () => ({
  'Authorization':  `Bearer ${PAT}`,
  'Content-Type':   'application/json'
});

// Fetch the single config record (returns null if table is empty)
async function getRecord() {
  const resp = await fetch(`${AT_URL}?maxRecords=1&fields%5B%5D=Config`, {
    headers: headers()
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `Airtable ${resp.status}`);
  }
  const data = await resp.json();
  return data.records?.[0] ?? null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!PAT) {
    // Airtable not configured yet — fall back gracefully
    if (req.method === 'GET') return res.json({ _notConfigured: true });
    return res.json({ ok: true, _notConfigured: true });
  }

  // ── GET: return current shared state ─────────────────────────
  if (req.method === 'GET') {
    try {
      const record = await getRecord();
      if (!record?.fields?.Config) return res.json({ _empty: true });
      return res.json(JSON.parse(record.fields.Config));
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── POST: save shared state ───────────────────────────────────
  if (req.method === 'POST') {
    try {
      const body    = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      body._savedAt = Date.now();

      let payload;

      if (body._juryOnly) {
        // Jury save: merge evals + assignments into existing state.
        // Never overwrite apps/headers/jury (those are admin-managed).
        // Assignments are merged by taking the longer array per app (more assigned = better).
        const record = await getRecord();
        const existing = record?.fields?.Config ? JSON.parse(record.fields.Config) : {};
        const existingAssign = existing.assignments || {};
        const newAssign      = body.assignments    || {};
        const mergedAssign   = { ...existingAssign };
        for (const [appId, jids] of Object.entries(newAssign)) {
          const prev = existingAssign[appId] || [];
          mergedAssign[appId] = jids.length >= prev.length ? jids : prev;
        }
        const merged = { ...existing, evals: body.evals, assignments: mergedAssign, _savedAt: body._savedAt };
        payload = JSON.stringify(merged);
      } else {
        // Admin/full save: keep only the fields needed for the jury list view.
        // Everything else (text answers, links) is fetched live from Airtable
        // when a jury member opens an app. This keeps the payload well under
        // Airtable's 100K character limit even with 300+ apps.
        const KEEP = new Set(['id','airtableId','name','campus','campusType','year','priority','gender','isRejected','email']);
        const appsToStore = (body.apps || []).map(a => {
          const cleaned = {};
          for (const k of KEEP) { if (a[k] !== undefined) cleaned[k] = a[k]; }
          return cleaned;
        });
        const slim = { ...body, apps: appsToStore };
        delete slim.colMap; // recomputed client-side from headers — no need to store
        payload = JSON.stringify(slim);

        // Guard: warn if still approaching limit (shouldn't happen with KEEP whitelist)
        if (payload.length > 95000) {
          console.warn(`[state] payload ${payload.length} chars — approaching 100K limit`);
        }
      }

      const record = await getRecord();

      if (record) {
        // Update existing record
        const resp = await fetch(`${AT_URL}/${record.id}`, {
          method:  'PATCH',
          headers: headers(),
          body:    JSON.stringify({ fields: { Config: payload } })
        });
        if (!resp.ok) throw new Error((await resp.json()).error?.message || 'Patch failed');
      } else {
        // First save — create the record
        const resp = await fetch(AT_URL, {
          method:  'POST',
          headers: headers(),
          body:    JSON.stringify({ fields: { Config: payload } })
        });
        if (!resp.ok) throw new Error((await resp.json()).error?.message || 'Create failed');
      }

      return res.json({ ok: true, savedAt: body._savedAt });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
