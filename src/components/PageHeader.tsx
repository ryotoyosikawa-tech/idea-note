import Image from 'next/image';

type Props = {
  title: string;
  subtitle?: string;
  english?: string;
};

export function PageHeader({ title, subtitle, english }: Props) {
  return (
    <header className="text-center mb-6">
      {english && (
        <div className="font-cormorant italic text-3xl sm:text-4xl tracking-wider text-[#2C1810] ink-stroke leading-none">
          {english}
        </div>
      )}
      <h1 className={`font-bold text-[#2C1810] ink-stroke ${english ? 'text-sm sm:text-base mt-1' : 'text-xl sm:text-2xl'}`}>
        {title}
      </h1>
      {subtitle && (
        <p className="text-[#6B4E37] text-[11px] sm:text-xs mt-2 tracking-[0.25em]">
          ─ {subtitle} ─
        </p>
      )}
      <div className="mt-3 flex justify-center opacity-70">
        <Image
          src="/assets/icons/19_flourish.png"
          alt=""
          width={280}
          height={28}
          className="h-6 w-auto"
        />
      </div>
    </header>
  );
}
