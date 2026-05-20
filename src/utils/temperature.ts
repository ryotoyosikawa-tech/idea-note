import type { Memo, Temperature } from '@/types';

export function judgeTemperature(memos: Memo[]): Temperature {
  if (memos.length === 0) return 'sleeping';

  const now = Date.now();
  const day = 1000 * 60 * 60 * 24;

  const recent7Count = memos.filter(
    (m) => now - new Date(m.created_at).getTime() <= 7 * day
  ).length;

  const last30dCount = memos.filter(
    (m) => now - new Date(m.created_at).getTime() <= 30 * day
  ).length;

  const latestDays = (now - new Date(memos[0].created_at).getTime()) / day;

  if (recent7Count >= 3) return 'rising';
  if (latestDays > 14) return 'sleeping';
  if (last30dCount >= 4) return 'building';
  return 'sleeping';
}
