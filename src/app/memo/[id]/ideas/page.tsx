import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMemoById } from '@/app/actions/memos';
import {
  getIdeasForMemo,
  getIdeaEvaluations,
} from '@/app/actions/ideas';
import { IdeaCard, CategoryHeader } from '@/components/IdeaCard';
import { ExpandableMemo } from '@/components/ExpandableMemo';
import { ThickDivider } from '@/components/Divider';
import { RegenerateLink } from '@/components/RegenerateLink';
import type { IdeaCategory } from '@/types';

const CATEGORIES: IdeaCategory[] = ['saas', 'product', 'service'];

export default async function IdeaResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memo = await getMemoById(id);
  if (!memo) notFound();

  const ideas = await getIdeasForMemo(id);
  const evaluations = await getIdeaEvaluations(ideas.map((i) => i.id));

  // 最新バッチを取得 (もう一度昇華 で複数バッチがある場合)
  const latestBatch = ideas[0]?.generation_batch_id;
  const latestIdeas = latestBatch
    ? ideas.filter((i) => i.generation_batch_id === latestBatch)
    : ideas;
  const previousIdeas = ideas.filter((i) => i.generation_batch_id !== latestBatch);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-4 pb-12">
      <div className="mb-3">
        <Link
          href={`/memo/${id}`}
          className="text-[#6B4E37] hover:text-[#8B0000] text-sm"
        >
          ← メモ詳細へ戻る
        </Link>
      </div>

      <header className="text-center mb-5">
        <h1 className="font-bold text-xl sm:text-2xl text-[#2C1810] ink-stroke leading-tight">
          新しい記述が
          <br />
          浮かび上がりました
        </h1>
      </header>

      <ExpandableMemo tag={memo.tag} content={memo.content} />

      <div className="my-5 text-center">
        <span className="font-cormorant italic text-sm text-[#6B4E37] tracking-widest">
          ✦ {latestIdeas.length}案 生成しました ✦
        </span>
      </div>

      {/* カテゴリごとに表示 */}
      {CATEGORIES.map((cat) => {
        const items = latestIdeas.filter((i) => i.category === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat} className="mb-4">
            <CategoryHeader category={cat} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {items.map((idea, idx) => {
                const ev = evaluations.get(idea.id);
                return (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    index={idx}
                    initialStatus={(ev?.status as 'interested' | 'meh' | null) ?? null}
                    initialCount={ev?.interest_count ?? 0}
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="my-6 text-center">
        <RegenerateLink memoId={id} />
      </div>

      {previousIdeas.length > 0 && (
        <>
          <ThickDivider />
          <details className="mt-3">
            <summary className="cursor-pointer text-center font-cormorant italic text-[#6B4E37] tracking-widest hover:text-[#8B0000]">
              ─ 以前生成した {previousIdeas.length}案 ─
            </summary>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
              {previousIdeas.map((idea, idx) => {
                const ev = evaluations.get(idea.id);
                return (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    index={idx}
                    initialStatus={(ev?.status as 'interested' | 'meh' | null) ?? null}
                    initialCount={ev?.interest_count ?? 0}
                  />
                );
              })}
            </div>
          </details>
        </>
      )}
    </div>
  );
}
