import { neon } from '@neondatabase/serverless';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const sql = neon(process.env.DATABASE_URL);
const userId = process.env.APP_USER_ID ?? 'ryoto';

const seeds = [
  { tag: '苦痛',   content: '駐車場が見つからなくて時間ロスがひどい。観光地でいつも探し回ってる。 #移動 #観光' },
  { tag: '気づき', content: '朝の散歩中に商品名のアイデアが降ってきた。歩いてる時の方が思考が深い。 #生活' },
  { tag: '閃き',   content: 'AIで台本書く時、最初の3秒のフックだけ別モデルで生成した方が精度高そう。 #TikTok' },
];

for (const s of seeds) {
  const hashtags = [...s.content.matchAll(/#([一-龯ぁ-んァ-ヶa-zA-Z0-9_]+)/g)].map((m) => m[1]);
  await sql`
    INSERT INTO memos (user_id, content, tag, hashtags)
    VALUES (${userId}, ${s.content}, ${s.tag}, ${hashtags})
  `;
  console.log(`Inserted: #${s.tag} ${s.content.slice(0, 30)}...`);
}

console.log('\nSeed done.');
