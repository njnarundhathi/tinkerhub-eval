// ════════════════════════════════════════════════════════════════
// TinkerHub Evaluation — Airtable Proxy (Vercel Serverless Function)
// ════════════════════════════════════════════════════════════════
//
// Environment variables to set in Vercel dashboard:
//   AIRTABLE_PAT      — Your Airtable Personal Access Token
//                       (Airtable → Account → Developer hub → Personal access tokens)
//   AIRTABLE_BASE_ID  — appdFV7VvqOIlQ36v
//   AIRTABLE_TABLE_ID — tblzxUFCLYl49JGSt  (or use table name "Evaluation Connect")
//   API_SECRET        — A secret string you choose (same one you put in the eval tool)
// ════════════════════════════════════════════════════════════════

const BASE_ID  = process.env.AIRTABLE_BASE_ID  || 'appdFV7VvqOIlQ36v';
const TABLE_ID = process.env.AIRTABLE_TABLE_ID || 'tblzxUFCLYl49JGSt';
const PAT      = process.env.AIRTABLE_PAT;
const SECRET   = process.env.API_SECRET;

const AT_BASE  = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

export default async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-secret');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── Auth check ────────────────────────────────────────────────
  const reqSecret = req.headers['x-api-secret'] || req.query.secret;
  if (SECRET && reqSecret !== SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if (!PAT) {
    return res.status(500).json({ error: 'AIRTABLE_PAT environment variable is not set' });
  }

  // ── GET: fetch all application records ───────────────────────
  if (req.method === 'GET') {
    try {
      const records = [];
      let offset = null;

      // Airtable paginates at 100 records — loop through all pages
      do {
        const url = new URL(AT_BASE);
        if (offset) url.searchParams.set('offset', offset);

        const resp = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${PAT}` }
        });
        const data = await resp.json();

        if (data.error) {
          return res.status(resp.status).json({ error: data.error.message || 'Airtable error' });
        }

        records.push(...(data.records || []));
        offset = data.offset || null;
      } while (offset);

      if (!records.length) {
        return res.json({ headers: [], rows: [] });
      }

      // Collect all field names across all records (order: first record determines order)
      const fieldSet = new Set();
      records.forEach(r => Object.keys(r.fields).forEach(f => fieldSet.add(f)));
      const fields = Array.from(fieldSet);

      // Build headers + rows (first column is always the Airtable record ID)
      const headers = ['_airtable_id', ...fields];
      const rows = records.map(r => [
        r.id,
        ...fields.map(f => {
          const v = r.fields[f];
          if (v === undefined || v === null) return '';
          if (Array.isArray(v))  return v.join(', ');
          if (typeof v === 'object' && v.url) return v.url;  // attachment
          return String(v);
        })
      ]);

      return res.json({ headers, rows, total: records.length });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── POST: write evaluation results back to Airtable ──────────
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { action, recordId, fields } = body;

      if (action === 'update_record') {
        if (!recordId) return res.status(400).json({ error: 'recordId required' });

        const resp = await fetch(`${AT_BASE}/${recordId}`, {
          method: 'PATCH',
          headers: {
            Authorization:  `Bearer ${PAT}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fields: fields || {} })
        });
        const data = await resp.json();
        if (data.error) return res.status(resp.status).json({ error: data.error.message });
        return res.json({ ok: true });
      }

      // Batch update (called on admin export — updates all evaluated records at once)
      if (action === 'batch_update') {
        const updates = body.updates || []; // [{recordId, fields}, ...]
        // Airtable batch PATCH: up to 10 records per request
        const chunks = [];
        for (let i = 0; i < updates.length; i += 10) chunks.push(updates.slice(i, i + 10));

        for (const chunk of chunks) {
          const resp = await fetch(AT_BASE, {
            method: 'PATCH',
            headers: {
              Authorization:  `Bearer ${PAT}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              records: chunk.map(u => ({ id: u.recordId, fields: u.fields }))
            })
          });
          const data = await resp.json();
          if (data.error) return res.status(resp.status).json({ error: data.error.message });
        }
        return res.json({ ok: true, updated: updates.length });
      }

      return res.status(400).json({ error: 'Unknown action' });

    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
