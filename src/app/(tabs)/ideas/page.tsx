import Link from 'next/link';
import { getInterestedIdeas } from '@/app/actions/ideas';
import { StarRating } from '@/components/StarRating';
import { ThickDivider } from '@/components/Divider';
import type { IdeaCategory } from '@/types';

const CATEGORY_LABEL: Record<IdeaCategory, string> = {
  saas: 'SaaS',
  product: 'プロダクト',
  service: 'サービス',
};

const CATEGORY_COLOR: Record<IdeaCategory, string> = {
  saas: '#2C3E5C',
  product: '#4A5D3A',
  service: '#7A2C2C',
};

type Search = { sort?: string; category?: string };

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const sort = (sp.sort === 'new' || sp.sort === 'category' ? sp.sort : 'interest') as
    | 'interest' | 'new' | 'category';
  const category = (sp.category as IdeaCategory | 'all') ?? 'all';

  const ideas = await getInterestedIdeas(sort, category);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-6 pb-12">
      {/* ヘッダー */}
      <header className="text-center mb-5">
        <h1 className="font-bold text-xl sm:text-2xl text-[#2C1810] ink-stroke">
          気になるアイデア
          <span className="font-cormorant italic text-[#8B0000] ml-2">({ideas.length}件)</span>
        </h1>
      </header>

      {/* ソートタブ */}
      <div className="flex gap-1 mb-3 p-1 parchment-deep rounded-md">
        {([
          ['interest', '気になり度順'],
          ['new', '新しい順'],
          ['category', 'カテゴリ別'],
        ] as const).map(([key, label]) => {
          const active = sort === key;
          const params = new URLSearchParams();
          params.set('sort', key);
          if (category !== 'all') params.set('category', category);
          return (
            <Link
              key={key}
              href={`/ideas?${params.toString()}`}
              className={`flex-1 text-center py-2 rounded text-xs sm:text-sm font-bold transition-all ${
                active
                  ? 'bg-[#8B0000]/85 text-[#F5E5C5] shadow-inner'
                  : 'text-[#6B4E37] hover:bg-[#7A512F]/10'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* カテゴリフィルタ */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {(['all', 'saas', 'product', 'service'] as const).map((c) => {
          const active = category === c;
          const label = c === 'all' ? 'すべて' : CATEGORY_LABEL[c];
          const params = new URLSearchParams();
          params.set('sort', sort);
          if (c !== 'all') params.set('category', c);
          return (
            <Link
              key={c}
              href={`/ideas?${params.toString()}`}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                active
                  ? 'bg-[#7A512F]/20 text-[#3A2818] border-[#7A512F]'
                  : 'bg-transparent text-[#6B4E37] border-[#7A512F]/30 hover:border-[#7A512F]/60'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* アイデアリスト */}
      {ideas.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
          {ideas.map((idea, idx) => (
            <li key={idea.id}>
              <Link
                href={`/memo/${idea.memo_id}/ideas`}
                className="parchment-card rounded-md p-4 sm:p-5 block tappable"
              >
                <div className="flex items-start gap-3">
                  <span className="font-cormorant italic text-2xl text-[#8B0000] leading-none mt-0.5">
                    {`①②③④⑤⑥⑦⑧⑨⑩`.charAt(idx) || `${idx + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-sm sm:text-base text-[#2C1810] leading-tight">
                        {idea.title}
                      </h3>
                      <StarRating count={idea.interest_count} />
                    </div>
                    <div
                      className="inline-block text-[10px] px-1.5 py-0.5 rounded font-bold mb-1.5"
                      style={{
                        color: CATEGORY_COLOR[idea.category],
                        backgroundColor: `${CATEGORY_COLOR[idea.category]}1a`,
                      }}
                    >
                      {CATEGORY_LABEL[idea.category]}
                    </div>
                    <p className="text-[#3A2818]/80 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {idea.niche_description}
                    </p>
                    <p className="text-[#6B4E37] text-[10px] sm:text-xs mt-2 italic">
                      元メモ:「{idea.source_memo_content.slice(0, 30)}{idea.source_memo_content.length > 30 ? '…' : ''}」
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <ThickDivider />

      <div className="text-center pt-2">
        <Link
          href="/ideas/all"
          className="text-[#6B4E37] hover:text-[#8B0000] text-sm underline font-cormorant italic tracking-widest"
        >
          すべてのアイデアを見る（未評価・微妙も含む）→
        </Link>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="parchment-card rounded-md p-8 text-center my-4">
      <div className="text-5xl mb-3 text-[#7A512F]/40">✦</div>
      <p className="text-[#3A2818]/80 mb-1">気になるアイデアがまだありません</p>
      <p className="text-[#6B4E37] text-sm">
        メモを書いて「アイデア昇華」→「気になる」を押すと、ここに育成されます。
      </p>
    </div>
  );
}
