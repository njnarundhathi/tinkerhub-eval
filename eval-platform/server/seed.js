#!/usr/bin/env node
/**
 * Bootstrap the first admin user.
 * Usage: node seed.js <email> [name]
 * Example: node seed.js admin@tinkerhub.org "Admin"
 */
const db = require('./db');

const [, , email, name = 'Admin'] = process.argv;

if (!email) {
  console.error('Usage: node seed.js <email> [name]');
  console.error('Example: node seed.js admin@tinkerhub.org "Admin"');
  process.exit(1);
}

try {
  const existing = db.prepare('SELECT * FROM reviewers WHERE LOWER(email) = LOWER(?)').get(email);

  if (existing) {
    db.prepare("UPDATE reviewers SET role = 'admin', name = ? WHERE LOWER(email) = LOWER(?)").run(name, email);
    console.log(`Updated ${email} → role: admin`);
  } else {
    const rid = `admin-${Date.now()}`;
    db.prepare("INSERT INTO reviewers (reviewer_id, name, email, role) VALUES (?, ?, ?, 'admin')").run(rid, name, email);
    console.log(`Created admin: ${name} <${email}>`);
  }
  console.log('\nYou can now log in at http://localhost:4000');
} catch (e) {
  console.error('Error:', e.message);
  process.exit(1);
}
