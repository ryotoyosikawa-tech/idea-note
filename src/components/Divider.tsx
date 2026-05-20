import Image from 'next/image';
import type { ReactNode } from 'react';

type Variant = 'thin' | 'thick' | 'flourish' | 'botanical';

const VARIANT_SRC: Record<Variant, string> = {
  thin:      '/assets/icons/16_divider_thin.png',
  thick:     '/assets/icons/17_divider_thick.png',
  flourish:  '/assets/icons/19_flourish.png',
  botanical: '/assets/icons/20_botanical_frame.png',
};

const VARIANT_HEIGHT: Record<Variant, number> = {
  thin: 16,
  thick: 56,
  flourish: 36,
  botanical: 40,
};

export function Divider({ variant = 'thin', className = '' }: { variant?: Variant; className?: string }) {
  return (
    <div className={`flex justify-center my-3 ${className}`}>
      <Image
        src={VARIANT_SRC[variant]}
        alt=""
        width={520}
        height={VARIANT_HEIGHT[variant]}
        className="max-w-full h-auto opacity-80"
      />
    </div>
  );
}

export function ThickDivider({ children }: { children?: ReactNode }) {
  if (children) {
    return (
      <div className="my-5 flex items-center gap-3">
        <Image
          src="/assets/icons/16_divider_thin.png"
          alt=""
          width={200}
          height={16}
          className="flex-1 opacity-75 h-auto"
        />
        <span className="text-[#7A512F] text-xs font-cormorant italic tracking-widest whitespace-nowrap">
          {children}
        </span>
        <Image
          src="/assets/icons/16_divider_thin.png"
          alt=""
          width={200}
          height={16}
          className="flex-1 opacity-75 h-auto scale-x-[-1]"
        />
      </div>
    );
  }
  return <Divider variant="thick" />;
}
