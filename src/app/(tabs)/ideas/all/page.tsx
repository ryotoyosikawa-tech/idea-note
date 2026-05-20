import Link from 'next/link';
import { sql } from '@/lib/db';
import { getCurrentUserId } from '@/lib/user';
import { StarRating } from '@/components/StarRating';
import type { Idea, IdeaCategory } from '@/types';

const CATEGORY_LABEL: Record<IdeaCategory, string> = {
  saas: 'SaaS',
  product: 'プロダクト',
  service: 'サービス',
};

type Row = Idea & {
  status: 'interested' | 'meh' | null;
  interest_count: number;
};

export default async function AllIdeasPage() {
  const userId = getCurrentUserId();
  const rows = await sql`
    SELECT i.*, e.status, COALESCE(e.interest_count, 0) AS interest_count
    FROM ideas i
    LEFT JOIN idea_evaluations e ON i.id = e.idea_id AND e.user_id = i.user_id
    WHERE i.user_id = ${userId}
    ORDER BY i.created_at DESC
  ` as Row[];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-6 pb-12">
      <div className="mb-3">
        <Link href="/ideas" className="text-[#6B4E37] hover:text-[#8B0000] text-sm">
          ← 気になるアイデアへ戻る
        </Link>
      </div>

      <header className="text-center mb-5">
        <h1 className="font-bold text-xl sm:text-2xl text-[#2C1810] ink-stroke">
          すべてのアイデア
          <span className="font-cormorant italic text-[#8B0000] ml-2">({rows.length}件)</span>
        </h1>
      </header>

      {rows.length === 0 ? (
        <div className="parchment-card rounded-md p-8 text-center">
          <p className="text-[#3A2818]/80">まだアイデアがありません</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((idea) => (
            <li key={idea.id}>
              <Link
                href={`/memo/${idea.memo_id}/ideas`}
                className="parchment-card rounded-md p-3 block tappable"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#7A512F]/15 text-[#3A2818] font-bold">
                        {CATEGORY_LABEL[idea.category]}
                      </span>
                      {idea.status === 'meh' && (
                        <span className="text-[10px] text-[#6B4E37]/70">微妙</span>
                      )}
                      {idea.status == null && (
                        <span className="text-[10px] text-[#6B4E37]/70">未評価</span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-[#2C1810] line-clamp-1">
                      {idea.title}
                    </h3>
                  </div>
                  {idea.status === 'interested' && (
                    <StarRating count={idea.interest_count} />
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
