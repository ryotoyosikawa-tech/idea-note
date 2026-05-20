import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMemoById, getRelatedMemos } from '@/app/actions/memos';
import { getIdeasForMemo } from '@/app/actions/ideas';
import { IdeaSubmitSeal } from '@/components/IdeaSubmitSeal';
import { tagPortraits, tagQuotes } from '@/lib/theme';

function formatDate(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

export default async function MemoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memo = await getMemoById(id);
  if (!memo) notFound();

  const [related, ideas] = await Promise.all([
    getRelatedMemos(memo),
    getIdeasForMemo(id),
  ]);

  const quote = tagQuotes[memo.tag];

  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 pt-6 pb-12">
      <div className="mb-4">
        <Link href="/board" className="text-[#6B4E37] hover:text-[#8B0000] text-sm font-cormorant italic tracking-wider">
          ← Back to Board
        </Link>
      </div>

      {/* タグタイトル + 偉人 */}
      <header className="text-center mb-5">
        <div className="font-bold text-2xl sm:text-3xl text-[#8B0000] ink-stroke mb-3">#{memo.tag}</div>
        <div className="portrait-frame w-28 h-28 sm:w-32 sm:h-32 mx-auto">
          <Image src={tagPortraits[memo.tag]} alt={memo.tag} fill className="object-cover" />
        </div>
        <blockquote className="font-cormorant italic text-[#3A2818] text-sm sm:text-base mt-3 max-w-md mx-auto leading-relaxed">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
      </header>

      {/* メモ本文 */}
      <article className="memo-paper relative px-8 sm:px-10 py-9 sm:py-10 mb-7 min-h-[280px]">
        <div className="absolute top-4 right-4 vermilion-stamp circle w-14 h-14 text-[10px] font-bold leading-tight">
          <div className="text-center">
            <div className="text-[8px] opacity-80">DATE</div>
            <div className="text-[9px]">{formatDate(memo.created_at)}</div>
          </div>
        </div>

        <p
          className="text-[#2C1810] text-base sm:text-lg whitespace-pre-wrap font-serif-jp pr-16"
          style={{ lineHeight: '34px' }}
        >
          {memo.content}
        </p>

        {memo.hashtags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {memo.hashtags.map((h) => (
              <span key={h} className="hashtag-chip">#{h}</span>
            ))}
          </div>
        )}
      </article>

      {/* アイデア昇華ボタン */}
      <div className="my-8 flex justify-center">
        <IdeaSubmitSeal memoId={memo.id} hasIdeas={ideas.length > 0} />
      </div>

      {/* 関連メモ */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-bold text-base text-[#2C1810] ink-stroke">関連メモ</h2>
          <span className="font-cormorant italic text-xs text-[#6B4E37] tracking-wider">
            Related Notes
          </span>
        </div>
        {related.length === 0 ? (
          <div className="parchment-card rounded-lg p-6 text-center text-[#6B4E37]/80 text-sm">
            まだ関連するメモはありません
          </div>
        ) : (
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/memo/${r.id}`}
                  className="parchment-card rounded-md p-3 sm:p-4 flex items-center justify-between gap-3 tappable"
                >
                  <span className="text-[#2C1810] text-sm truncate flex-1">· {r.content}</span>
                  <span className="text-[#6B4E37] text-xs font-cormorant italic whitespace-nowrap">
                    {formatDate(r.created_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
