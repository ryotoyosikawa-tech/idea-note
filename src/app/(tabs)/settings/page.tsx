import { sql } from '@/lib/db';
import { getCurrentUserId } from '@/lib/user';

type Stat = {
  memos: number;
  ideas: number;
  interested: number;
};

async function getStats(): Promise<Stat> {
  const userId = getCurrentUserId();
  const memoRows = await sql`SELECT COUNT(*)::int AS n FROM memos WHERE user_id = ${userId}` as Array<{ n: number }>;
  const ideaRows = await sql`SELECT COUNT(*)::int AS n FROM ideas WHERE user_id = ${userId}` as Array<{ n: number }>;
  const intRows  = await sql`
    SELECT COUNT(*)::int AS n FROM idea_evaluations
    WHERE user_id = ${userId} AND status = 'interested'
  ` as Array<{ n: number }>;
  return {
    memos: memoRows[0]?.n ?? 0,
    ideas: ideaRows[0]?.n ?? 0,
    interested: intRows[0]?.n ?? 0,
  };
}

export default async function SettingsPage() {
  const stats = await getStats();
  const userId = getCurrentUserId();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-6 pb-12">
      <header className="text-center mb-6">
        <h1 className="font-bold text-xl sm:text-2xl text-[#2C1810] ink-stroke">
          設定
        </h1>
        <p className="font-cormorant italic text-[#6B4E37] text-sm mt-1">Settings</p>
      </header>

      <section className="parchment-card rounded-md p-5 mb-4">
        <h2 className="font-bold text-base text-[#2C1810] mb-3 border-b border-[#7A512F]/20 pb-2">
          ノートの記録
        </h2>
        <dl className="grid grid-cols-3 gap-3 text-center">
          {[
            ['メモ', stats.memos],
            ['アイデア', stats.ideas],
            ['気になる', stats.interested],
          ].map(([label, n]) => (
            <div key={label as string} className="parchment-deep rounded p-3">
              <dt className="text-xs text-[#6B4E37] mb-1">{label}</dt>
              <dd className="font-cormorant text-2xl text-[#3A2818] font-bold">{n}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="parchment-card rounded-md p-5 mb-4">
        <h2 className="font-bold text-base text-[#2C1810] mb-3 border-b border-[#7A512F]/20 pb-2">
          AI モデル
        </h2>
        <div className="space-y-2 text-sm">
          <Row label="モデル" value={process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'} />
          <Row label="プロジェクト" value={process.env.GOOGLE_CLOUD_PROJECT ?? '(未設定)'} />
          <Row label="リージョン" value={process.env.GOOGLE_CLOUD_LOCATION ?? 'us-central1'} />
        </div>
        <p className="text-[10px] text-[#6B4E37]/70 mt-3">
          切り替えは Vercel 環境変数 GEMINI_MODEL から（pro / flash / flash-lite）
        </p>
      </section>

      <section className="parchment-card rounded-md p-5 mb-4">
        <h2 className="font-bold text-base text-[#2C1810] mb-3 border-b border-[#7A512F]/20 pb-2">
          ユーザー
        </h2>
        <div className="space-y-2 text-sm">
          <Row label="USER_ID" value={userId} />
          <p className="text-[10px] text-[#6B4E37]/70 mt-2">
            Phase 1 個人用モード — 認証なし、APP_USER_ID 環境変数で識別
          </p>
        </div>
      </section>

      <p className="text-center text-[10px] text-[#6B4E37]/60 mt-6 font-cormorant italic tracking-widest">
        Idea Note · Anno MMXXVI
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[#6B4E37]">{label}</dt>
      <dd className="text-[#2C1810] font-mono text-xs truncate max-w-[60%]">{value}</dd>
    </div>
  );
}
