'use client';

import Image from 'next/image';
import { useState, useTransition } from 'react';
import { evaluateIdeaAction } from '@/app/actions/ideas';
import type { Idea, IdeaCategory } from '@/types';

const CATEGORY_INFO: Record<IdeaCategory, { label: string; color: string; stamp: string }> = {
  saas:    { label: 'SaaS / アプリ開発', color: '#2C3E5C', stamp: '/assets/stamps/07_saas.png' },
  product: { label: 'プロダクト',         color: '#4A5D3A', stamp: '/assets/stamps/08_product.png' },
  service: { label: 'サービス',           color: '#7A2C2C', stamp: '/assets/stamps/09_service.png' },
};

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

      <div className="flex items-center justify-between pt-3 border-t border-[#7A512F]/25">
        <div className="text-[10px] text-[#6B4E37] font-cormorant italic">
          {status === 'interested' && count > 0 && `気になる ×${count}`}
        </div>
        <div className="flex gap-3">
          <StampButton
            src="/assets/stamps/02_kininaru.png"
            label="気になる"
            active={status === 'interested'}
            disabled={pending}
            onClick={() => submit('interested')}
          />
          <StampButton
            src="/assets/stamps/03_bimyou.png"
            label="微妙"
            active={status === 'meh'}
            disabled={pending}
            onClick={() => submit('meh')}
          />
        </div>
      </div>
    </div>
  );
}

function StampButton({
  src, label, active, disabled, onClick,
}: { src: string; label: string; active: boolean; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className={`relative w-14 h-14 sm:w-16 sm:h-16 transition-all ${
        active ? 'scale-110 drop-shadow-[0_2px_4px_rgba(58,40,24,0.4)]' : 'opacity-65 hover:opacity-100'
      } ${disabled ? 'cursor-not-allowed' : 'hover:scale-105'}`}
    >
      <Image src={src} alt={label} fill className="object-contain" />
    </button>
  );
}

export function CategoryHeader({ category }: { category: IdeaCategory }) {
  const info = CATEGORY_INFO[category];
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#7A512F]/45 to-[#7A512F]/45" />
      <div className="flex items-center gap-2">
        <div className="relative w-12 h-12">
          <Image src={info.stamp} alt={info.label} fill className="object-contain" />
        </div>
        <span
          className="font-bold text-sm sm:text-base tracking-wider"
          style={{ color: info.color }}
        >
          {info.label}
        </span>
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#7A512F]/45 to-[#7A512F]/45" />
    </div>
  );
}
