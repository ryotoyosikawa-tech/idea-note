import { sql } from '@/lib/db';
import { getCurrentUserId } from '@/lib/user';
import { PageHeader } from '@/components/PageHeader';

type Stat = { memos: number; ideas: number; interested: number };

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
    <div className="mx-auto max-w-2xl px-5 sm:px-8 pt-8 pb-12">
      <PageHeader english="Settings" title="設定" subtitle="System Configuration" />

      <section className="parchment-card rounded-lg p-6 mb-4">
        <SectionTitle jp="ノートの記録" en="Records" />
        <dl className="grid grid-cols-3 gap-3 text-center mt-3">
          {[
            ['メモ', 'Memos', stats.memos],
            ['アイデア', 'Ideas', stats.ideas],
            ['気になる', 'Cultivated', stats.interested],
          ].map(([label, en, n]) => (
            <div key={label as string} className="engraved-frame p-4 bg-[#EBD7B0]/50">
              <dd className="font-cormorant text-3xl text-[#3A2818] font-bold leading-none">{n}</dd>
              <dt className="text-xs text-[#3A2818] mt-2 font-bold">{label}</dt>
              <dt className="text-[10px] text-[#6B4E37] font-cormorant italic">{en}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="parchment-card rounded-lg p-6 mb-4">
        <SectionTitle jp="AI モデル" en="Vertex AI" />
        <div className="space-y-2 text-sm mt-3">
          <Row label="モデル" value={process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'} />
          <Row label="プロジェクト" value={process.env.GOOGLE_CLOUD_PROJECT ?? '(未設定)'} />
          <Row label="リージョン" value={process.env.GOOGLE_CLOUD_LOCATION ?? 'us-central1'} />
        </div>
        <p className="text-[10px] text-[#6B4E37]/80 mt-3 font-cormorant italic">
          モデル切替は Vercel 環境変数 GEMINI_MODEL から (pro / flash / flash-lite)
        </p>
      </section>

      <section className="parchment-card rounded-lg p-6">
        <SectionTitle jp="ユーザー" en="Account" />
        <div className="space-y-2 text-sm mt-3">
          <Row label="USER_ID" value={userId} />
        </div>
        <p className="text-[10px] text-[#6B4E37]/80 mt-3 font-cormorant italic">
          Phase 1 個人用モード ─ APP_USER_ID 環境変数で識別
        </p>
      </section>

      <p className="text-center text-[10px] text-[#6B4E37]/70 mt-8 font-cormorant italic tracking-[0.3em]">
        Idea Note · Anno MMXXVI
      </p>
    </div>
  );
}

function SectionTitle({ jp, en }: { jp: string; en: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-[#7A512F]/25 pb-2">
      <h2 className="font-bold text-base text-[#2C1810] ink-stroke">{jp}</h2>
      <span className="font-cormorant italic text-xs text-[#6B4E37] tracking-wider">{en}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <dt className="text-[#6B4E37] text-xs sm:text-sm">{label}</dt>
      <dd className="text-[#2C1810] font-mono text-xs truncate max-w-[65%] text-right">{value}</dd>
    </div>
  );
}
