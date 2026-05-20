import Image from 'next/image';
import type { Temperature } from '@/types';

const TEMP_STAMP: Record<Temperature, { src: string; label: string }> = {
  rising:   { src: '/assets/stamps/04_netsuryou_jousho.png', label: '熱量上昇中' },
  building: { src: '/assets/stamps/05_tsumiagari.png',       label: '積み上がり中' },
  sleeping: { src: '/assets/stamps/06_nemutteiru.png',       label: '眠っている' },
};

export function TemperatureStamp({
  temp,
  size = 40,
  showLabel = true,
}: {
  temp: Temperature;
  size?: number;
  showLabel?: boolean;
}) {
  const info = TEMP_STAMP[temp];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative shrink-0" style={{ width: size, height: size }}>
        <Image src={info.src} alt={info.label} fill className="object-contain" />
      </span>
      {showLabel && (
        <span className="text-[10px] sm:text-xs font-bold text-[#3A2818] tracking-wider">
          {info.label}
        </span>
      )}
    </span>
  );
}

export function IdeatedBadge({ count }: { count: number }) {
  return (
    <span className="vermilion-stamp square text-[10px] font-bold px-2 py-1">
      {count}案 生成済
    </span>
  );
}
