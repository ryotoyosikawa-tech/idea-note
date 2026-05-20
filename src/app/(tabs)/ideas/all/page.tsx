import Link from 'next/link';
import { sql } from '@/lib/db';
import { getCurrentUserId } from '@/lib/user';
import { StarRating } from '@/components/StarRating';
import { PageHeader } from '@/components/PageHeader';
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
    <div className="mx-auto max-w-4xl px-5 sm:px-8 pt-6 pb-12">
      <div className="mb-4">
        <Link href="/ideas" className="text-[#6B4E37] hover:text-[#8B0000] text-sm font-cormorant italic tracking-wider">
          ← Back to Cultivation
        </Link>
      </div>

      <PageHeader
        english="All Ideas"
        title="すべてのアイデア"
        subtitle={`${rows.length} total`}
      />

      {rows.length === 0 ? (
        <div className="parchment-card rounded-lg p-10 text-center">
          <p className="text-[#3A2818]">まだアイデアがありません</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((idea) => (
            <li key={idea.id}>
              <Link
                href={`/memo/${idea.memo_id}/ideas`}
                className="parchment-card rounded-md p-3 sm:p-4 block tappable"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="hashtag-chip">{CATEGORY_LABEL[idea.category]}</span>
                      {idea.status === 'meh' && (
                        <span className="text-[10px] text-[#6B4E37]/80 font-bold">微妙</span>
                      )}
                      {idea.status == null && (
                        <span className="text-[10px] text-[#6B4E37]/80 font-bold">未評価</span>
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
