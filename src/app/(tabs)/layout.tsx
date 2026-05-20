import type { ReactNode } from 'react';
import { NavShell } from '@/components/NavShell';

export default function TabsLayout({ children }: { children: ReactNode }) {
  return <NavShell>{children}</NavShell>;
}
