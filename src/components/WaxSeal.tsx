'use client';

import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type SealVariant = 'crown' | 'laurel' | 'arabesque';

type Props = {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: SealVariant;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const SIZE_CLASS = {
  sm: 'w-20 h-20 text-xs',
  md: 'w-28 h-28 text-sm',
  lg: 'w-36 h-36 text-base',
};

const SEAL_BG: Record<SealVariant, string> = {
  crown:     "url('/assets/stamps/10_wax_crown.png')",
  laurel:    "url('/assets/stamps/11_wax_laurel.png')",
  arabesque: "url('/assets/stamps/12_wax_arabesque.png')",
};

export function WaxSeal({
  children,
  size = 'md',
  variant = 'crown',
  className = '',
  style,
  ...props
}: Props) {
  return (
    <button
      className={`wax-seal-img ${SIZE_CLASS[size]} ${className}`}
      style={{ ...style, backgroundImage: SEAL_BG[variant] }}
      {...props}
    >
      <span className="flex flex-col items-center text-center px-3 leading-tight">
        {children}
      </span>
    </button>
  );
}
