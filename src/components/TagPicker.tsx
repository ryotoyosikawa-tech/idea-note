'use client';

import Image from 'next/image';
import { ALL_TAGS, tagPortraits } from '@/lib/theme';
import type { TagType } from '@/types';

type Props = {
  selected: TagType;
  onChange: (tag: TagType) => void;
};

export function TagPicker({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-1 -mx-1">
      {ALL_TAGS.map((tag) => {
        const active = tag === selected;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(tag)}
            className={`shrink-0 flex flex-col items-center gap-1 px-2 py-1.5 rounded-md transition-all ${
              active ? 'bg-[#7A512F]/15 ring-1 ring-[#8B0000]/40' : 'opacity-60 hover:opacity-90'
            }`}
          >
            <div
              className={`portrait-frame w-12 h-12 relative ${
                active ? '' : 'grayscale-[0.4]'
              }`}
            >
              <Image src={tagPortraits[tag]} alt={tag} fill className="object-cover" />
            </div>
            <span className={`text-[10px] font-bold ${active ? 'text-[#8B0000]' : 'text-[#6B4E37]'}`}>
              #{tag}
            </span>
          </button>
        );
      })}
    </div>
  );
}
