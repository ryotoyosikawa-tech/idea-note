import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Run `vercel env pull .env.local` first.');
  process.exit(1);
}

const schemaPath = resolve(__dirname, '../db/schema.sql');
const rawSql = readFileSync(schemaPath, 'utf-8');

// 行頭コメントを除去してからセミコロンで分割
const cleaned = rawSql
  .split('\n')
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n');

const statements = cleaned
  .split(/;\s*(?:\n|$)/)
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

const sql = neon(process.env.DATABASE_URL);
console.log(`Running ${statements.length} statements against Neon...`);

for (const [i, stmt] of statements.entries()) {
  const preview = stmt.replace(/\s+/g, ' ').slice(0, 70);
  try {
    await sql.query(stmt);
    console.log(`  [${i + 1}/${statements.length}] OK    ${preview}...`);
  } catch (e) {
    if (e.message?.includes('already exists')) {
      console.log(`  [${i + 1}/${statements.length}] SKIP  ${preview}...`);
    } else {
      console.error(`  [${i + 1}/${statements.length}] FAIL  ${preview}...`);
      console.error('    ', e.message);
      process.exit(1);
    }
  }
}

console.log('\nDone. Schema applied.');
