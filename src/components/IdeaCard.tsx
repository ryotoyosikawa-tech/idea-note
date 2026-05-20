'use client';

import { useState, useTransition } from 'react';
import { evaluateIdeaAction } from '@/app/actions/ideas';
import type { Idea } from '@/types';

const CATEGORY_INFO = {
  saas:    { label: 'SaaS / アプリ開発',         color: '#2C3E5C', stampIcon: '/assets/stamps/07_saas.png' },
  product: { label: 'プロダクト',                 color: '#4A5D3A', stampIcon: '/assets/stamps/08_product.png' },
  service: { label: 'サービス',                   color: '#7A2C2C', stampIcon: '/assets/stamps/09_service.png' },
} as const;

type Props = {
  idea: Idea;
  index: number;
  initialStatus?: 'interested' | 'meh' | null;
  initialCount?: number;
};

export function IdeaCard({ idea, index, initialStatus, initialCount = 0 }: Props) {
  const [status, setStatus] = useState<'interested' | 'meh' | null>(initialStatus ?? null);
  const [count, setCount] = useState(initialCount);
  const [pending, startTransition] = useTransition();

  const submit = (s: 'interested' | 'meh') => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set('ideaId', idea.id);
      fd.set('status', s);
      await evaluateIdeaAction(fd);
      setStatus(s);
      if (s === 'interested') setCount((c) => c + 1);
    });
  };

  return (
    <div className="parchment-card rounded-md p-4 sm:p-5">
      <div className="flex items-start gap-2 mb-2">
        <span className="font-cormorant italic text-2xl text-[#8B0000] leading-none">
          {`①②③④⑤⑥`.charAt(index) || `${index + 1}`}
        </span>
        <h3 className="font-bold text-base sm:text-lg text-[#2C1810] leading-tight flex-1">
          {idea.title}
        </h3>
      </div>

      <p className="text-[#3A2818]/85 text-xs sm:text-sm leading-relaxed mb-2 whitespace-pre-wrap">
        {idea.niche_description}
      </p>
      <p className="text-[#6B4E37] text-xs sm:text-sm leading-relaxed mb-3 whitespace-pre-wrap font-cormorant italic">
        {idea.business_model}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-[#7A512F]/20">
        <div className="text-[10px] text-[#6B4E37] font-cormorant italic">
          {status === 'interested' && count > 0 && `気になる ×${count}`}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => submit('interested')}
            className={`vermilion-stamp square text-[10px] sm:text-xs px-3 py-1.5 transition-all ${
              status === 'interested' ? 'bg-[#8B0000]/20 scale-105' : ''
            } ${pending ? 'opacity-50' : 'hover:scale-105'}`}
          >
            気になる
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => submit('meh')}
            className={`text-[10px] sm:text-xs px-3 py-1.5 rounded border border-[#6B4E37]/40 text-[#6B4E37] transition-all ${
              status === 'meh' ? 'bg-[#6B4E37]/20' : ''
            } ${pending ? 'opacity-50' : 'hover:bg-[#7A512F]/10'}`}
          >
            微妙
          </button>
        </div>
      </div>
    </div>
  );
}

export function CategoryHeader({ category }: { category: keyof typeof CATEGORY_INFO }) {
  const info = CATEGORY_INFO[category];
  return (
    <div className="flex items-center gap-2 my-3">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#7A512F]/40 to-[#7A512F]/40" />
      <div
        className="px-3 py-1 rounded text-xs sm:text-sm font-bold tracking-wider"
        style={{ color: info.color, borderTop: `1px solid ${info.color}40`, borderBottom: `1px solid ${info.color}40` }}
      >
        {info.label}
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#7A512F]/40 to-[#7A512F]/40" />
    </div>
  );
}
