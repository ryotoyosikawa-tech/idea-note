import Image from 'next/image';
import Link from 'next/link';
import { tagPortraits } from '@/lib/theme';
import type { TagType } from '@/types';

const TAG_SUBTITLES: Record<TagType, string> = {
  苦痛: 'エジソン',
  違和感: 'コペルニクス',
  欲求: 'ライト兄弟',
  気づき: 'ニュートン',
  閃き: 'アルキメデス',
  兆し: 'ダヴィンチ',
  夢: 'アインシュタイン',
};

type Props = {
  tag: TagType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  href?: string;
};

const SIZE_CLASS = {
  sm: 'w-14 h-14',
  md: 'w-20 h-20 sm:w-24 sm:h-24',
  lg: 'w-32 h-32 sm:w-40 sm:h-40',
};

export function PortraitFrame({ tag, size = 'md', showLabel = true, href }: Props) {
  const inner = (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`portrait-frame ${SIZE_CLASS[size]}`}>
        <Image
          src={tagPortraits[tag]}
          alt={TAG_SUBTITLES[tag]}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 96px, 160px"
        />
      </div>
      {showLabel && (
        <div className="text-center leading-tight">
          <div className="text-[#7A2C2C] font-bold text-sm sm:text-base ink-stroke">
            #{tag}
          </div>
          <div className="text-[#6B4E37] text-[10px] sm:text-xs font-cormorant italic">
            {TAG_SUBTITLES[tag]}
          </div>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="tappable">
        {inner}
      </Link>
    );
  }
  return inner;
}
