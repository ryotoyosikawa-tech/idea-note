'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WaxSeal } from './WaxSeal';
import { generateIdeasForMemo } from '@/app/actions/ideas';

type Props = {
  memoId: string;
  hasIdeas: boolean;
};

export function IdeaSubmitSeal({ memoId, hasIdeas }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function trigger() {
    setPending(true);
    setError(null);
    try {
      await generateIdeasForMemo(memoId);
      router.push(`/memo/${memoId}/ideas`);
    } catch (e) {
      setError(e instanceof Error ? e.message : '失敗しました');
      setPending(false);
    }
  }

  if (hasIdeas && !pending) {
    return (
      <div className="flex flex-col items-center gap-2">
        <WaxSeal size="lg" onClick={() => router.push(`/memo/${memoId}/ideas`)}>
          <span className="text-base">アイデア</span>
          <span className="text-base">を見る</span>
        </WaxSeal>
        <button
          type="button"
          onClick={trigger}
          className="text-xs text-[#6B4E37] underline hover:text-[#8B0000]"
        >
          もう一度昇華する
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <WaxSeal size="lg" disabled={pending} onClick={trigger}>
        {pending ? (
          <>
            <span className="text-sm">昇華中…</span>
            <span className="text-[10px] tracking-widest mt-0.5">AI 生成</span>
          </>
        ) : (
          <>
            <span className="text-base">アイデア</span>
            <span className="text-base">昇華</span>
          </>
        )}
      </WaxSeal>
      {error && (
        <p className="text-[#8B0000] text-xs max-w-xs text-center">{error}</p>
      )}
    </div>
  );
}
