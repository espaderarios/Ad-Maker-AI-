/*
Node script to export MongoDB collections to SQL INSERT statements suitable for D1 (SQLite).
Usage: set MONGO_URI then run: node scripts/migrate/mongo_to_d1.js
This will produce workers/migrations/import_data.sql
*/
import fs from 'fs';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI || process.env.DATABASE_URL;
if (!uri) {
  console.error('Set MONGO_URI or DATABASE_URL environment variable to your Mongo connection string');
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db();

  let out = '';

  // Users
  const users = await db.collection('User').find().toArray().catch(() => db.collection('users').find().toArray());
  for (const u of users) {
    const email = (u.email || '').replace(/'/g, "''");
    const name = (u.name || '').replace(/'/g, "''");
    const password = (u.password || '').replace(/'/g, "''");
    out += `INSERT INTO users (email, password, name, created_at, updated_at) VALUES ('${email}', '${password}', '${name}', datetime('now'), datetime('now'));
`;
  }

  // Projects
  const projects = await db.collection('Project').find().toArray().catch(() => db.collection('projects').find().toArray());
  for (const p of projects) {
    const title = (p.title || '').replace(/'/g, "''");
    const description = (p.description || '').replace(/'/g, "''");
    // Note: user id mapping may be required; import may need manual linking
    out += `INSERT INTO projects (title, description, user_id, status, created_at, updated_at) VALUES ('${title}', '${description}', 1, '${p.status || 'draft'}', datetime('now'), datetime('now'));
`;
  }

  fs.writeFileSync('workers/migrations/import_data.sql', out);
  console.log('Wrote workers/migrations/import_data.sql — review and run against D1');
  await client.close();
}

main().catch((err) => { console.error(err); process.exit(1); });
