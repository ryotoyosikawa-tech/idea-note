'use client';

import { useState } from 'react';
import Image from 'next/image';
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
        <WaxSeal size="lg" variant="laurel" onClick={() => router.push(`/memo/${memoId}/ideas`)}>
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
    <div className="flex flex-col items-center gap-3">
      {pending ? (
        <div className="w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center">
          <div className="relative w-32 h-32 animate-pulse">
            <Image
              src="/assets/stamps/01_idea_shouka.png"
              alt="アイデア昇華中"
              fill
              className="object-contain opacity-60"
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={trigger}
          disabled={pending}
          className="tappable relative w-40 h-40 sm:w-44 sm:h-44 hover:scale-105 transition-transform duration-200 disabled:opacity-50"
          aria-label="アイデア昇華"
        >
          <Image
            src="/assets/stamps/01_idea_shouka.png"
            alt="アイデア昇華"
            fill
            className="object-contain drop-shadow-[0_4px_8px_rgba(139,0,0,0.35)]"
          />
        </button>
      )}
      {pending && (
        <p className="text-[#8B0000] text-sm font-cormorant italic tracking-widest">
          AI が思考を昇華しています…
        </p>
      )}
      {error && (
        <p className="text-[#8B0000] text-xs max-w-xs text-center">{error}</p>
      )}
    </div>
  );
}
