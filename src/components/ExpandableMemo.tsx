'use client';

import { useState } from 'react';
import type { TagType } from '@/types';

type Props = {
  tag: TagType;
  content: string;
};

export function ExpandableMemo({ tag, content }: Props) {
  const [open, setOpen] = useState(false);
  const preview = content.length > 80 ? content.slice(0, 80) + '…' : content;

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="parchment-card rounded-md p-4 w-full text-left flex items-start gap-3 tappable border-l-4 border-l-[#8B0000]/60"
    >
      <div className="shrink-0">
        <div className="font-cormorant italic text-[10px] text-[#8B0000] tracking-widest">SOURCE</div>
        <div className="font-bold text-xs text-[#8B0000] mt-0.5">元メモ</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-[#6B4E37] mb-1 font-bold tracking-wider">#{tag}</div>
        <p className="text-[#2C1810] text-xs sm:text-sm leading-relaxed">
          {open ? content : preview}
        </p>
      </div>
      <span className="text-[#6B4E37] text-xs shrink-0 mt-1">
        {open ? '▲' : '▼'}
      </span>
    </button>
  );
}
