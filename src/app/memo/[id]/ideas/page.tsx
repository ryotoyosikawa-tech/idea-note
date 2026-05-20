import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMemoById } from '@/app/actions/memos';
import {
  getIdeasForMemo,
  getIdeaEvaluations,
} from '@/app/actions/ideas';
import { IdeaCard, CategoryHeader } from '@/components/IdeaCard';
import { ExpandableMemo } from '@/components/ExpandableMemo';
import { RegenerateLink } from '@/components/RegenerateLink';
import { PageHeader } from '@/components/PageHeader';
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

  const latestBatch = ideas[0]?.generation_batch_id;
  const latestIdeas = latestBatch
    ? ideas.filter((i) => i.generation_batch_id === latestBatch)
    : ideas;
  const previousIdeas = ideas.filter((i) => i.generation_batch_id !== latestBatch);

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 pt-6 pb-12">
      <div className="mb-4">
        <Link
          href={`/memo/${id}`}
          className="text-[#6B4E37] hover:text-[#8B0000] text-sm font-cormorant italic tracking-wider"
        >
          ← Back to Memo
        </Link>
      </div>

      <PageHeader
        english="Sublimation"
        title="新しい記述が浮かび上がりました"
      />

      <ExpandableMemo tag={memo.tag} content={memo.content} />

      <div className="my-7 flex items-center justify-center gap-3">
        <Image src="/assets/icons/16_divider_thin.png" alt="" width={120} height={12} className="opacity-70 h-3 w-auto" />
        <span className="font-cormorant italic text-sm text-[#6B4E37] tracking-[0.25em] whitespace-nowrap">
          {latestIdeas.length} ideas generated
        </span>
        <Image src="/assets/icons/16_divider_thin.png" alt="" width={120} height={12} className="opacity-70 h-3 w-auto scale-x-[-1]" />
      </div>

      {CATEGORIES.map((cat) => {
        const items = latestIdeas.filter((i) => i.category === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat} className="mb-6">
            <CategoryHeader category={cat} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

      <div className="my-8 text-center">
        <RegenerateLink memoId={id} />
      </div>

      {previousIdeas.length > 0 && (
        <details className="mt-6">
          <summary className="cursor-pointer text-center font-cormorant italic text-sm text-[#6B4E37] tracking-widest hover:text-[#8B0000] py-2">
            ─ View {previousIdeas.length} previous ideas ─
          </summary>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
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
      )}
    </div>
  );
}
