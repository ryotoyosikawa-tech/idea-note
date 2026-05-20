import Link from 'next/link';
import { PortraitFrame } from '@/components/PortraitFrame';
import { Stamp } from '@/components/Stamp';
import { ThickDivider } from '@/components/Divider';
import { OrnamentFrame } from '@/components/OrnamentFrame';
import { getBoardData } from '@/app/actions/memos';
import { ALL_TAGS } from '@/lib/theme';
import type { TagType, Temperature, ThemeCard as ThemeCardData } from '@/types';

const TEMP_LABEL: Record<Temperature, { jp: string; variant: 'rising' | 'building' | 'sleeping' }> = {
  rising:   { jp: '熱量上昇中', variant: 'rising' },
  building: { jp: '積み上がり中', variant: 'building' },
  sleeping: { jp: '眠っている', variant: 'sleeping' },
};

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
      <header className="text-center mb-6">
        <h1 className="font-cormorant italic text-4xl sm:text-5xl tracking-wider text-[#2C1810] ink-stroke">
          Idea Note
        </h1>
        <p className="text-[#6B4E37] text-xs sm:text-sm mt-1 tracking-[0.2em]">
          ─ メモがアイデアに昇華されるノート ─
        </p>
      </header>

      {/* 偉人グリッド: モバイル2-3-2 / デスクトップは7枚横並び */}
      <section className="mb-8 lg:hidden">
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
      <section className="hidden lg:block mb-10">
        <OrnamentFrame className="px-6 py-6 parchment-card rounded-md">
          <div className="grid grid-cols-7 gap-4">
            {ALL_TAGS.map((tag) => (
              <PortraitFrame key={tag} tag={tag} size="md" href={`/write?tag=${encodeURIComponent(tag)}`} />
            ))}
          </div>
        </OrnamentFrame>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
  const tempInfo = TEMP_LABEL[card.temperature];
  return (
    <Link
      href={`/write?tag=${encodeURIComponent(card.tag)}`}
      className="parchment-card rounded-md p-4 tappable block"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#8B0000]/70 font-cormorant text-sm">{String(index).padStart(2, '0')}</span>
            <h3 className="font-bold text-base sm:text-lg text-[#2C1810] truncate">
              #{card.tag}
            </h3>
          </div>
          {card.excerpts.slice(0, 1).map((ex, i) => (
            <p key={i} className="text-[#3A2818]/80 text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {ex}
            </p>
          ))}
        </div>
        {card.ideated_memo_count > 0 && (
          <Stamp variant="ideated" shape="square" className="shrink-0">
            {card.ideated_memo_count}案生成済
          </Stamp>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <Stamp variant={tempInfo.variant} shape="square">{tempInfo.jp}</Stamp>
        <div className="text-[#6B4E37] font-cormorant italic">
          memo {card.memo_count} · 抜粋 {Math.min(card.excerpts.length, 3)}
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="parchment-card rounded-md p-8 text-center">
      <div className="text-5xl mb-3 text-[#7A512F]/40">✒</div>
      <p className="text-[#3A2818]/80 mb-1">まだメモがありません</p>
      <p className="text-[#6B4E37] text-sm">上の偉人を選んで、最初の一筆を残してください。</p>
    </div>
  );
}
