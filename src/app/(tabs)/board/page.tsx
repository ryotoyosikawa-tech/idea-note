import Link from 'next/link';
import Image from 'next/image';
import { PortraitFrame } from '@/components/PortraitFrame';
import { TemperatureStamp, IdeatedBadge } from '@/components/Stamp';
import { Divider, ThickDivider } from '@/components/Divider';
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

  // 2-3-2 配置 (モバイル) / lgでは横並び
  const grid: TagType[][] = [
    [ALL_TAGS[0], ALL_TAGS[1]],
    [ALL_TAGS[2], ALL_TAGS[3], ALL_TAGS[4]],
    [ALL_TAGS[5], ALL_TAGS[6]],
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6 pb-12">
      {/* ヘッダー */}
      <header className="text-center mb-3">
        <h1 className="font-cormorant italic text-4xl sm:text-5xl tracking-wider text-[#2C1810] ink-stroke">
          Idea Note
        </h1>
        <p className="text-[#6B4E37] text-xs sm:text-sm mt-1 tracking-[0.2em]">
          ─ メモがアイデアに昇華されるノート ─
        </p>
      </header>

      <Divider variant="flourish" />

      {/* 偉人グリッド */}
      <section className="mb-6 lg:hidden">
        <div className="flex flex-col gap-4 items-center">
          {grid.map((row, i) => (
            <div key={i} className="flex gap-4 justify-center flex-wrap">
              {row.map((tag) => (
                <PortraitFrame key={tag} tag={tag} size="md" href={`/write?tag=${encodeURIComponent(tag)}`} />
              ))}
            </div>
          ))}
        </div>
      </section>
      <section className="hidden lg:block mb-8">
        <div className="parchment-burnt px-8 py-8">
          <div className="grid grid-cols-7 gap-4">
            {ALL_TAGS.map((tag) => (
              <PortraitFrame key={tag} tag={tag} size="md" href={`/write?tag=${encodeURIComponent(tag)}`} />
            ))}
          </div>
        </div>
      </section>

      <ThickDivider />

      {/* 整理されたメモ */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="font-bold text-lg sm:text-xl text-[#2C1810] ink-stroke">
            整理されたメモ
          </h2>
        </div>

        {/* ソートタブ */}
        <div className="flex gap-1 mb-4 p-1 parchment-deep rounded-md">
          {(['hot', 'new', 'sleeping'] as const).map((key) => {
            const label = key === 'hot' ? '熱い順' : key === 'new' ? '新しい順' : '眠ってる順';
            const active = sort === key;
            return (
              <Link
                key={key}
                href={`/board?sort=${key}`}
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

        {/* テーマカード一覧 */}
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
      className="parchment-card rounded-md p-5 tappable block min-h-[140px]"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[#8B0000]/70 font-cormorant text-sm">
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
        <p key={i} className="text-[#3A2818]/85 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3">
          {ex}
        </p>
      ))}

      <div className="flex items-end justify-between gap-2 pt-2 border-t border-[#7A512F]/20">
        <TemperatureStamp temp={card.temperature} size={36} />
        <div className="text-[10px] text-[#6B4E37] font-cormorant italic text-right">
          memo {card.memo_count} 件<br />抜粋 {Math.min(card.excerpts.length, 3)} 件
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="parchment-card rounded-md p-8 text-center">
      <Image
        src="/assets/icons/01_quill.png"
        alt=""
        width={60}
        height={60}
        className="mx-auto opacity-50 mb-2"
      />
      <p className="text-[#3A2818]/80 mb-1">まだメモがありません</p>
      <p className="text-[#6B4E37] text-sm">上の偉人を選んで、最初の一筆を残してください。</p>
    </div>
  );
}
