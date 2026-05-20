'use client';

import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const SIZE_CLASS = {
  sm: 'w-16 h-16 text-xs',
  md: 'w-24 h-24 text-sm',
  lg: 'w-32 h-32 text-base',
};

export function WaxSeal({ children, size = 'md', className = '', ...props }: Props) {
  return (
    <button
      className={`wax-seal ${SIZE_CLASS[size]} ${className}`}
      {...props}
    >
      <span className="relative flex flex-col items-center leading-tight text-center px-2 drop-shadow">
        {children}
      </span>
    </button>
  );
}
