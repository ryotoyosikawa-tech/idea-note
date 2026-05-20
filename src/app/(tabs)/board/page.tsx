import Link from 'next/link';
import Image from 'next/image';
import { PortraitFrame } from '@/components/PortraitFrame';
import { TemperatureStamp, IdeatedBadge } from '@/components/Stamp';
import { PageHeader } from '@/components/PageHeader';
import { getBoardData } from '@/app/actions/memos';
import { ALL_TAGS } from '@/lib/theme';
import type { TagType, ThemeCard as ThemeCardData } from '@/types';

type Search = { sort?: string };

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const sort = (sp.sort === 'new' || sp.sort === 'sleeping' ? sp.sort : 'hot') as 'hot' | 'new' | 'sleeping';

  const cards = await getBoardData(sort);

  // 2-3-2 配置 (モバイル)
  const mobileGrid: TagType[][] = [
    [ALL_TAGS[0], ALL_TAGS[1]],
    [ALL_TAGS[2], ALL_TAGS[3], ALL_TAGS[4]],
    [ALL_TAGS[5], ALL_TAGS[6]],
  ];

  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 pt-8 pb-12">
      <PageHeader
        english="Idea Note"
        title="メモがアイデアに昇華されるノート"
      />

      {/* 偉人グリッド */}
      <section className="parchment-card rounded-lg px-5 sm:px-8 py-7 mb-8">
        <div className="text-center font-cormorant italic text-sm text-[#6B4E37] mb-5 tracking-[0.25em]">
          ─ Choose Your Muse ─
        </div>

        {/* モバイル: 2-3-2 / デスクトップ: 7列 */}
        <div className="lg:hidden flex flex-col gap-5 items-center">
          {mobileGrid.map((row, i) => (
            <div key={i} className="flex gap-5 justify-center flex-wrap">
              {row.map((tag) => (
                <PortraitFrame key={tag} tag={tag} size="md" href={`/write?tag=${encodeURIComponent(tag)}`} />
              ))}
            </div>
          ))}
        </div>
        <div className="hidden lg:grid grid-cols-7 gap-3">
          {ALL_TAGS.map((tag) => (
            <PortraitFrame key={tag} tag={tag} size="md" href={`/write?tag=${encodeURIComponent(tag)}`} />
          ))}
        </div>
      </section>

      {/* 整理されたメモ */}
      <section>
        <div className="flex items-baseline justify-between mb-4 px-1">
          <h2 className="font-bold text-lg sm:text-xl text-[#2C1810] ink-stroke">
            整理されたメモ
          </h2>
          <span className="font-cormorant italic text-xs text-[#6B4E37] tracking-wider">
            Organized Memos
          </span>
        </div>

        {/* ソートタブ */}
        <div className="flex gap-2 mb-5">
          {(['hot', 'new', 'sleeping'] as const).map((key) => {
            const label = key === 'hot' ? '熱い順' : key === 'new' ? '新しい順' : '眠ってる順';
            const active = sort === key;
            return (
              <Link
                key={key}
                href={`/board?sort=${key}`}
                className={`tab-pill flex-1 text-center ${active ? 'active' : ''}`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* テーマカード */}
        {cards.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {cards.map((card, idx) => (
              <ThemeCard key={card.tag} card={card} index={idx + 1} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ThemeCard({ card, index }: { card: ThemeCardData; index: number }) {
  return (
    <Link
      href={`/write?tag=${encodeURIComponent(card.tag)}`}
      className="parchment-card rounded-lg p-5 tappable block min-h-[150px]"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="text-[#8B0000]/65 font-cormorant text-sm">
            {String(index).padStart(2, '0')}
          </span>
          <h3 className="font-bold text-base sm:text-lg text-[#2C1810] truncate ink-stroke">
            #{card.tag}
          </h3>
        </div>
        {card.ideated_memo_count > 0 && (
          <IdeatedBadge count={card.ideated_memo_count} />
        )}
      </div>

      {card.excerpts.slice(0, 1).map((ex, i) => (
        <p key={i} className="text-[#3A2818]/85 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3 min-h-[2.5rem]">
          {ex}
        </p>
      ))}

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#7A512F]/22">
        <TemperatureStamp temp={card.temperature} size={36} />
        <div className="text-[10px] text-[#6B4E37] font-cormorant italic text-right whitespace-nowrap">
          memo {card.memo_count} 件 · 抜粋 {Math.min(card.excerpts.length, 3)}
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="parchment-card rounded-lg p-10 text-center">
      <Image
        src="/assets/icons/01_quill.png"
        alt=""
        width={64}
        height={64}
        className="mx-auto opacity-55 mb-4"
      />
      <p className="text-[#3A2818] mb-2 font-bold">まだメモがありません</p>
      <p className="text-[#6B4E37] text-sm">
        上の偉人を選んで、最初の一筆を残してください。
      </p>
      <div className="mt-4 font-cormorant italic text-xs text-[#6B4E37]/70 tracking-widest">
        ─ Per aspera ad astra ─
      </div>
    </div>
  );
}
