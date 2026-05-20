import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export function OrnamentFrame({ children, className = '' }: Props) {
  return (
    <div className={`relative ${className}`}>
      {/* Decorative corners */}
      <div className="pointer-events-none absolute -top-2 -left-2 text-[#7A512F]/50 text-xl select-none">❦</div>
      <div className="pointer-events-none absolute -top-2 -right-2 text-[#7A512F]/50 text-xl select-none">❦</div>
      <div className="pointer-events-none absolute -bottom-2 -left-2 text-[#7A512F]/50 text-xl select-none">❦</div>
      <div className="pointer-events-none absolute -bottom-2 -right-2 text-[#7A512F]/50 text-xl select-none">❦</div>
      {children}
    </div>
  );
}
