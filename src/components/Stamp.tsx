import type { ReactNode } from 'react';

type StampVariant = 'rising' | 'building' | 'sleeping' | 'ideated' | 'category' | 'custom';

type Props = {
  children: ReactNode;
  variant?: StampVariant;
  shape?: 'square' | 'circle';
  className?: string;
};

const VARIANT_CLASS: Record<StampVariant, string> = {
  rising:    'bg-[#8B0000]/10 text-[#8B0000] border-[#8B0000]',
  building:  'bg-[#B8860B]/15 text-[#7A5C00] border-[#7A5C00]',
  sleeping:  'bg-[#4B2C5E]/10 text-[#4B2C5E] border-[#4B2C5E]',
  ideated:   'bg-[#2C3E5C]/10 text-[#2C3E5C] border-[#2C3E5C]',
  category:  'bg-[#4A5D3A]/10 text-[#4A5D3A] border-[#4A5D3A]',
  custom:    '',
};

export function Stamp({ children, variant = 'custom', shape = 'square', className = '' }: Props) {
  return (
    <span
      className={`vermilion-stamp ${shape} ${VARIANT_CLASS[variant]} text-[10px] sm:text-xs font-bold ${className}`}
    >
      {children}
    </span>
  );
}
