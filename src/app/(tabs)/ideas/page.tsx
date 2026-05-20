import Link from 'next/link';
import Image from 'next/image';
import { getInterestedIdeas } from '@/app/actions/ideas';
import { StarRating } from '@/components/StarRating';
import { PageHeader } from '@/components/PageHeader';
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
    <div className="mx-auto max-w-4xl px-5 sm:px-8 pt-8 pb-12">
      <PageHeader
        english="Cultivation"
        title="気になるアイデア"
        subtitle={`${ideas.length} cultivated ideas`}
      />

      {/* ソートタブ */}
      <div className="flex gap-2 mb-3">
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
              className={`tab-pill flex-1 text-center ${active ? 'active' : ''}`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* カテゴリフィルタ */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
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
              className={`chip ${active ? 'active' : ''}`}
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
                className="parchment-card rounded-lg p-4 sm:p-5 block tappable"
              >
                <div className="flex items-start gap-3">
                  <span className="font-cormorant italic text-3xl text-[#8B0000] leading-none mt-1">
                    {`①②③④⑤⑥⑦⑧⑨⑩`.charAt(idx) || `${idx + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-bold text-sm sm:text-base text-[#2C1810] leading-snug ink-stroke">
                        {idea.title}
                      </h3>
                      <StarRating count={idea.interest_count} />
                    </div>
                    <div
                      className="inline-block text-[10px] px-2 py-0.5 rounded font-bold mb-2 border"
                      style={{
                        color: CATEGORY_COLOR[idea.category],
                        backgroundColor: `${CATEGORY_COLOR[idea.category]}12`,
                        borderColor: `${CATEGORY_COLOR[idea.category]}55`,
                      }}
                    >
                      {CATEGORY_LABEL[idea.category]}
                    </div>
                    <p className="text-[#3A2818]/85 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {idea.niche_description}
                    </p>
                    <p className="text-[#6B4E37] text-[10px] sm:text-xs mt-2 italic font-cormorant">
                      元メモ:「{idea.source_memo_content.slice(0, 40)}{idea.source_memo_content.length > 40 ? '…' : ''}」
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/ideas/all"
          className="inline-flex items-center gap-2 text-[#6B4E37] hover:text-[#8B0000] text-sm font-cormorant italic tracking-widest"
        >
          すべてのアイデアを見る
          <span>→</span>
        </Link>
        <div className="text-[10px] text-[#6B4E37]/60 mt-1">未評価・微妙も含む</div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="parchment-card rounded-lg p-10 text-center">
      <Image src="/assets/icons/11_sun.png" alt="" width={64} height={64} className="mx-auto opacity-55 mb-3" />
      <p className="text-[#3A2818] mb-2 font-bold">気になるアイデアがまだありません</p>
      <p className="text-[#6B4E37] text-sm">
        メモ詳細で「アイデア昇華」→ 気になるものに「気になる」を押すと、ここに育成されます。
      </p>
      <div className="mt-4 font-cormorant italic text-xs text-[#6B4E37]/70 tracking-widest">
        ─ Cultivate your finest ideas ─
      </div>
    </div>
  );
}
