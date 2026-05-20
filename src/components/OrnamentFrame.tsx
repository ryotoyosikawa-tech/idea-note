import Image from 'next/image';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

/** botanical_frame の縁を上下に配置した枠 */
export function OrnamentFrame({ children, className = '' }: Props) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/assets/icons/20_botanical_frame.png"
        alt=""
        width={680}
        height={40}
        className="w-full h-auto opacity-90"
      />
      <div className="px-4 py-4">{children}</div>
      <Image
        src="/assets/icons/20_botanical_frame.png"
        alt=""
        width={680}
        height={40}
        className="w-full h-auto opacity-90 scale-y-[-1]"
      />
    </div>
  );
}
