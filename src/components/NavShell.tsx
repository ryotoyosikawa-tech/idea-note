'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const TABS = [
  { href: '/board',    label: 'ボード',   icon: '/assets/icons/08_compass.png', en: 'Board' },
  { href: '/write',    label: '書く',     icon: '/assets/icons/01_quill.png',   en: 'Write' },
  { href: '/ideas',    label: 'アイデア', icon: '/assets/icons/11_sun.png',     en: 'Ideas' },
  { href: '/settings', label: '設定',     icon: '/assets/icons/10_key.png',     en: 'Settings' },
];

function isActive(pathname: string, href: string) {
  if (href === '/board') return pathname === '/' || pathname.startsWith('/board');
  if (href === '/ideas') return pathname.startsWith('/ideas');
  return pathname.startsWith(href);
}

export function NavShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[100dvh] lg:flex">
      {/* デスクトップ: サイドバー */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 sticky top-0 h-[100dvh] parchment-deep border-r border-[#7A512F]/35">
        <div className="px-6 pt-7 pb-5 text-center border-b border-[#7A512F]/30">
          <Link href="/board" className="block">
            <div className="font-cormorant italic text-3xl text-[#2C1810] tracking-wider leading-none">
              Idea Note
            </div>
            <div className="text-[#5A4128] text-[10px] mt-2 tracking-[0.25em] uppercase">
              memoria
            </div>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 flex-1 px-3 py-4 overflow-y-auto">
          {TABS.map((tab) => {
            const active = isActive(pathname, tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
                  active
                    ? 'bg-[#7A512F]/22 text-[#2C1810] border border-[#7A512F]/40 shadow-inner'
                    : 'text-[#5A4128] hover:bg-[#7A512F]/10 border border-transparent'
                }`}
              >
                <Image src={tab.icon} alt="" width={22} height={22} className={active ? 'opacity-90' : 'opacity-70'} />
                <span className="flex-1">
                  <span className={`block font-bold text-sm tracking-wider ${active ? 'ink-stroke' : ''}`}>
                    {tab.label}
                  </span>
                  <span className="block font-cormorant italic text-[10px] text-[#5A4128] tracking-wider">
                    {tab.en}
                  </span>
                </span>
                {active && (
                  <span className="text-[#8B0000] text-base font-cormorant italic">·</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-[#7A512F]/25 text-center">
          <div className="text-[#5A4128]/70 text-[10px] font-cormorant italic tracking-[0.3em]">
            Anno MMXXVI
          </div>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 min-w-0 pb-24 lg:pb-12">
        {children}
      </main>

      {/* モバイル: ボトムナビ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 parchment-deep border-t border-[#7A512F]/40 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex justify-around">
          {TABS.map((tab) => {
            const active = isActive(pathname, tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center gap-0.5 flex-1 py-1.5 rounded-md transition-all ${
                  active ? 'text-[#8B0000]' : 'text-[#5A4128]'
                }`}
              >
                <Image
                  src={tab.icon}
                  alt=""
                  width={24}
                  height={24}
                  className={active ? 'opacity-100' : 'opacity-70'}
                />
                <span className={`text-[10px] font-bold tracking-wider ${active ? 'ink-stroke' : ''}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
