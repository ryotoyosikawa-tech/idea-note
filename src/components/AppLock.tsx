'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';

const STORAGE_KEY = 'idea-note:unlocked';
const PASSCODE = '000';

export function AppLock({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'locked' | 'unlocked'>('checking');
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const unlocked = localStorage.getItem(STORAGE_KEY) === '1';
      setStatus(unlocked ? 'unlocked' : 'locked');
    } catch {
      setStatus('locked');
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === PASSCODE) {
      try {
        localStorage.setItem(STORAGE_KEY, '1');
      } catch {}
      setStatus('unlocked');
      setError(false);
    } else {
      setError(true);
      setInput('');
    }
  }

  if (status === 'checking') {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="text-[#6B4E37] font-cormorant italic text-sm tracking-widest">
          Loading…
        </div>
      </div>
    );
  }

  if (status === 'locked') {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="parchment-card rounded-lg p-8 sm:p-10 w-full max-w-sm text-center"
        >
          <div className="font-cormorant italic text-3xl tracking-wider text-[#2C1810] ink-stroke">
            Idea Note
          </div>
          <div className="text-[#6B4E37] text-[10px] mt-2 tracking-[0.3em] uppercase">
            Locked
          </div>

          <div className="my-7 flex justify-center">
            <Image
              src="/assets/icons/10_key.png"
              alt=""
              width={56}
              height={56}
              className="opacity-75"
            />
          </div>

          <label className="block text-left mb-1.5 text-[11px] font-bold tracking-[0.2em] text-[#6B4E37]">
            PASSCODE
          </label>
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            autoComplete="off"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(false);
            }}
            placeholder="• • •"
            className={`w-full px-4 py-3 rounded-md bg-[#F4E6C5] border outline-none text-center text-2xl tracking-[0.5em] text-[#2C1810] placeholder-[#6B4E37]/40 ${
              error ? 'border-[#8B0000]' : 'border-[#7A512F]/40 focus:border-[#7A512F]'
            }`}
          />
          {error && (
            <p className="text-[#8B0000] text-xs mt-2 font-cormorant italic">
              ─ Incorrect passcode ─
            </p>
          )}

          <button
            type="submit"
            className="mt-5 w-full px-5 py-3 rounded-md bg-[#8B0000] text-[#F5E5C5] font-bold tracking-[0.2em] text-sm hover:bg-[#5A0000] transition-colors disabled:opacity-50"
            disabled={input.length === 0}
          >
            UNLOCK
          </button>

          <p className="text-[#6B4E37]/70 text-[10px] mt-5 font-cormorant italic tracking-wider">
            一度入力すれば、次回以降は不要です
          </p>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
