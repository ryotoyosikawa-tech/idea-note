import type { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
  ornament?: 'star' | 'flourish' | 'fleur' | 'simple';
};

const ORNAMENTS = {
  star: '✦',
  flourish: '❦',
  fleur: '⚜',
  simple: '◆',
};

export function Divider({ children, ornament = 'star' }: Props) {
  return (
    <div className="ornament-divider my-3">
      <span>{children ?? ORNAMENTS[ornament]}</span>
    </div>
  );
}

export function ThickDivider() {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#7A512F]/50 to-transparent" />
      <div className="text-[#7A512F]/70 text-sm">✦ ✦ ✦</div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#7A512F]/50 to-transparent" />
    </div>
  );
}
