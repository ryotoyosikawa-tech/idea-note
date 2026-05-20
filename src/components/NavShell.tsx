'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const TABS = [
  { href: '/board',    label: 'ボード',   icon: '/assets/icons/08_compass.png' },
  { href: '/write',    label: '書く',     icon: '/assets/icons/01_quill.png' },
  { href: '/ideas',    label: 'アイデア', icon: '/assets/icons/11_sun.png' },
  { href: '/settings', label: '設定',     icon: '/assets/icons/10_key.png' },
];

function isActive(pathname: string, href: string) {
  if (href === '/board') return pathname === '/' || pathname.startsWith('/board');
  return pathname.startsWith(href);
}

export function NavShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-[100dvh] flex">
      {/* デスクトップ: サイドバー */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-0 h-[100dvh] parchment-deep border-r border-[#7A512F]/30 p-6">
        <Link href="/board" className="block mb-8 text-center">
          <div className="font-cormorant italic text-3xl text-[#3A2818] tracking-wider">
            Idea Note
          </div>
          <div className="text-[#6B4E37] text-xs mt-1 tracking-wider">
            ─ メモがアイデアに昇華される ─
          </div>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {TABS.map((tab) => {
            const active = isActive(pathname, tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                  active
                    ? 'bg-[#7A512F]/15 text-[#3A2818] border-l-2 border-[#8B0000]'
                    : 'text-[#6B4E37] hover:bg-[#7A512F]/8'
                }`}
              >
                <Image src={tab.icon} alt="" width={24} height={24} className="opacity-80" />
                <span className="font-bold text-sm tracking-wider">{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="text-center pt-4 border-t border-[#7A512F]/20">
          <div className="text-[#6B4E37]/60 text-[10px] font-cormorant italic tracking-widest">
            Anno MMXXVI
          </div>
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1 min-w-0 pb-24 lg:pb-8">
        {children}
      </main>

      {/* モバイル: ボトムナビ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 parchment-deep border-t-2 border-[#7A512F]/40 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex justify-around">
          {TABS.map((tab) => {
            const active = isActive(pathname, tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center gap-0.5 flex-1 py-1.5 rounded-md transition-all ${
                  active ? 'text-[#8B0000]' : 'text-[#6B4E37]'
                }`}
              >
                <Image
                  src={tab.icon}
                  alt=""
                  width={26}
                  height={26}
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
