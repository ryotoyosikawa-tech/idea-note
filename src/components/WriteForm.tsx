'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TagPicker } from './TagPicker';
import { WaxSeal } from './WaxSeal';
import { tagPortraits, tagQuotes } from '@/lib/theme';
import { createMemoAction } from '@/app/actions/memos';
import type { TagType } from '@/types';

type Props = {
  initialTag: TagType;
};

export function WriteForm({ initialTag }: Props) {
  const [tag, setTag] = useState<TagType>(initialTag);
  const [content, setContent] = useState('');
  const [pending, setPending] = useState(false);
  const portrait = tagPortraits[tag];
  const quote = tagQuotes[tag];

  return (
    <form
      action={async (formData) => {
        setPending(true);
        try {
          formData.set('tag', tag);
          await createMemoAction(formData);
        } catch (e) {
          setPending(false);
          throw e;
        }
      }}
      className="mx-auto max-w-2xl px-4 sm:px-6 pt-4 pb-12"
    >
      {/* 上部: タグタイトル + 偉人 + 名言 */}
      <div className="text-center mb-3">
        <div className="font-bold text-2xl text-[#8B0000] ink-stroke mb-2">#{tag}</div>
        <div className="portrait-frame w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-3">
          <Image src={portrait} alt={tag} fill className="object-cover" />
        </div>
        <blockquote className="font-cormorant italic text-[#3A2818] text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <div className="text-[#6B4E37] text-xs font-cormorant italic mt-1">
          ─ {quote.author} ─
        </div>
      </div>

      {/* タグ切替 */}
      <details className="mb-3 group">
        <summary className="text-center text-xs text-[#6B4E37] cursor-pointer hover:text-[#8B0000] py-1">
          タグを変更
        </summary>
        <TagPicker selected={tag} onChange={setTag} />
      </details>

      {/* メモ用紙 (罫線入り羊皮紙テクスチャ) */}
      <div className="memo-paper relative px-7 sm:px-10 py-8 sm:py-10 mb-5 min-h-[360px]">
        <div className="absolute top-4 right-5 text-[#7A512F]/45 text-xs font-cormorant italic select-none">
          {new Date().toISOString().slice(0, 10).replace(/-/g, '.')}
        </div>
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="ここに気づきを書く..."
          rows={10}
          required
          className="w-full bg-transparent text-[#2C1810] placeholder-[#6B4E37]/55 outline-none resize-none text-base sm:text-lg leading-loose font-serif-jp"
          style={{ lineHeight: '2.1rem' }}
        />
        <div className="mt-2 text-right text-[10px] text-[#6B4E37]/70 font-cormorant italic">
          {content.length} 文字
        </div>
      </div>

      {/* 装飾アイコン + ワックスシール送信 */}
      <div className="flex items-center justify-around gap-2">
        <Image
          src="/assets/icons/01_quill.png"
          alt=""
          width={56}
          height={56}
          className="opacity-75 drop-shadow"
        />
        <WaxSeal type="submit" size="lg" variant="crown" disabled={pending || !content.trim()}>
          {pending ? (
            <span className="text-base">送信中…</span>
          ) : (
            <>
              <span className="text-xl">送信</span>
              <span className="text-[10px] tracking-[0.3em] mt-1 opacity-90">SEND</span>
            </>
          )}
        </WaxSeal>
        <Image
          src="/assets/icons/03_open_book.png"
          alt=""
          width={56}
          height={56}
          className="opacity-75 drop-shadow"
        />
      </div>

      <div className="text-center text-[10px] text-[#6B4E37]/70 mt-3 font-cormorant italic">
        本文に #事業領域 などのハッシュタグを含めると後で整理されます
      </div>
    </form>
  );
}
