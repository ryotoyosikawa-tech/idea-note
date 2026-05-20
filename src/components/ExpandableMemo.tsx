'use client';

import { useState } from 'react';
import type { TagType } from '@/types';

type Props = {
  tag: TagType;
  content: string;
};

export function ExpandableMemo({ tag, content }: Props) {
  const [open, setOpen] = useState(false);
  const preview = content.length > 60 ? content.slice(0, 60) + '…' : content;

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="parchment-deep rounded-md p-3 w-full text-left flex items-start gap-3 tappable"
    >
      <span className="text-[#8B0000] font-bold text-xs shrink-0 mt-0.5">元メモ</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-[#6B4E37] mb-0.5">#{tag}</div>
        <p className="text-[#2C1810] text-xs sm:text-sm leading-relaxed">
          {open ? content : preview}
        </p>
      </div>
      <span className="text-[#6B4E37] text-xs shrink-0">
        {open ? '▲' : '▼'}
      </span>
    </button>
  );
}
