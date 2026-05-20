'use client';

import Image from 'next/image';
import { useState, useTransition } from 'react';
import { evaluateIdeaAction } from '@/app/actions/ideas';
import type { Idea, IdeaCategory } from '@/types';

const CATEGORY_INFO: Record<IdeaCategory, { label: string; en: string; color: string; stamp: string }> = {
  saas:    { label: 'SaaS / アプリ開発', en: 'Software',   color: '#2C3E5C', stamp: '/assets/stamps/07_saas.png' },
  product: { label: 'プロダクト',         en: 'Product',    color: '#4A5D3A', stamp: '/assets/stamps/08_product.png' },
  service: { label: 'サービス',           en: 'Service',    color: '#7A2C2C', stamp: '/assets/stamps/09_service.png' },
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
    <div className="parchment-card rounded-lg p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-3">
        <span className="font-cormorant italic text-3xl text-[#8B0000] leading-none mt-0.5">
          {`①②③④⑤⑥`.charAt(index) || `${index + 1}`}
        </span>
        <h3 className="font-bold text-base sm:text-lg text-[#2C1810] leading-snug flex-1 ink-stroke">
          {idea.title}
        </h3>
      </div>

      <p className="text-[#3A2818]/90 text-xs sm:text-sm leading-relaxed mb-3 whitespace-pre-wrap">
        {idea.niche_description}
      </p>
      <p className="text-[#6B4E37] text-xs sm:text-sm leading-relaxed mb-4 whitespace-pre-wrap font-cormorant italic">
        {idea.business_model}
      </p>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#7A512F]/22">
        <div className="text-[10px] text-[#6B4E37] font-cormorant italic">
          {status === 'interested' && count > 0 && `Interested ×${count}`}
        </div>
        <div className="flex gap-3 items-center">
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
      className={`relative w-16 h-16 sm:w-[72px] sm:h-[72px] transition-all ${
        active
          ? 'scale-110 drop-shadow-[0_3px_5px_rgba(58,40,24,0.45)]'
          : 'opacity-60 hover:opacity-100 hover:scale-105'
      } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
    >
      <Image src={src} alt={label} fill className="object-contain" />
    </button>
  );
}

export function CategoryHeader({ category }: { category: IdeaCategory }) {
  const info = CATEGORY_INFO[category];
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#7A512F]/45 to-[#7A512F]/45" />
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0">
          <Image src={info.stamp} alt={info.label} fill className="object-contain" />
        </div>
        <div className="leading-tight">
          <div className="font-bold text-sm sm:text-base tracking-wider" style={{ color: info.color }}>
            {info.label}
          </div>
          <div className="font-cormorant italic text-[10px] sm:text-xs text-[#6B4E37] tracking-widest">
            {info.en}
          </div>
        </div>
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#7A512F]/45 to-[#7A512F]/45" />
    </div>
  );
}
