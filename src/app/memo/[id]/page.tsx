import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMemoById, getRelatedMemos } from '@/app/actions/memos';
import { getIdeasForMemo } from '@/app/actions/ideas';
import { IdeaSubmitSeal } from '@/components/IdeaSubmitSeal';
import { Divider, ThickDivider } from '@/components/Divider';
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
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-4 pb-12">
      <div className="mb-3">
        <Link href="/board" className="text-[#6B4E37] hover:text-[#8B0000] text-sm">
          ← ボードへ戻る
        </Link>
      </div>

      {/* タグタイトル + 偉人 */}
      <header className="text-center mb-4">
        <div className="font-bold text-2xl text-[#8B0000] ink-stroke mb-2">#{memo.tag}</div>
        <div className="portrait-frame w-28 h-28 sm:w-36 sm:h-36 mx-auto">
          <Image src={tagPortraits[memo.tag]} alt={memo.tag} fill className="object-cover" />
        </div>
        <blockquote className="font-cormorant italic text-[#3A2818] text-sm mt-2 max-w-md mx-auto">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
      </header>

      {/* メモ本文: 罫線入り羊皮紙テクスチャ */}
      <article className="memo-paper relative px-7 sm:px-10 py-8 sm:py-10 mb-5 min-h-[260px]">
        {/* 日付スタンプ (朱印風円形) */}
        <div className="absolute top-4 right-5 vermilion-stamp circle w-14 h-14 text-[10px] font-bold leading-tight text-center">
          <div className="leading-tight">
            <div className="text-[8px] opacity-80">DATE</div>
            <div className="text-[9px]">{formatDate(memo.created_at)}</div>
          </div>
        </div>

        <p className="text-[#2C1810] text-base sm:text-lg leading-loose whitespace-pre-wrap font-serif-jp pr-16" style={{ lineHeight: '2.1rem' }}>
          {memo.content}
        </p>

        {memo.hashtags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {memo.hashtags.map((h) => (
              <span
                key={h}
                className="text-[10px] px-2 py-0.5 rounded bg-[#7A512F]/15 text-[#3A2818] font-bold"
              >
                #{h}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* アイデア昇華ボタン (大きな朱印画像) */}
      <div className="my-8 flex justify-center">
        <IdeaSubmitSeal memoId={memo.id} hasIdeas={ideas.length > 0} />
      </div>

      <ThickDivider>関連メモへのリンク</ThickDivider>

      {/* 関連メモ */}
      <section>
        {related.length === 0 ? (
          <p className="text-center text-[#6B4E37]/70 text-sm py-4">
            まだ関連するメモはありません
          </p>
        ) : (
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/memo/${r.id}`}
                  className="parchment-card rounded-md p-3 flex items-center justify-between gap-3 tappable"
                >
                  <span className="text-[#2C1810] text-sm truncate flex-1">
                    · {r.content}
                  </span>
                  <span className="text-[#6B4E37] text-xs font-cormorant whitespace-nowrap">
                    {formatDate(r.created_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Divider variant="thin" className="mt-6" />
    </div>
  );
}
