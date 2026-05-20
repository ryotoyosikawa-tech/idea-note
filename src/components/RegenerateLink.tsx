'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateIdeasForMemo } from '@/app/actions/ideas';

export function RegenerateLink({ memoId }: { memoId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function regenerate() {
    setPending(true);
    setError(null);
    try {
      await generateIdeasForMemo(memoId);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : '失敗しました');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={regenerate}
        className="text-[#8B0000] underline font-bold text-sm hover:text-[#5A0000] disabled:opacity-50"
      >
        {pending ? '昇華中…' : 'もう6案 追加で生成する'}
      </button>
      {error && <p className="text-[#8B0000] text-xs">{error}</p>}
    </div>
  );
}
