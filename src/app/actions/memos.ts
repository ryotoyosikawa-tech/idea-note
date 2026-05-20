'use server';

import { sql } from '@/lib/db';
import { getCurrentUserId } from '@/lib/user';
import { extractHashtags } from '@/utils/hashtag';
import { judgeTemperature } from '@/utils/temperature';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Memo, TagType, ThemeCard, Temperature } from '@/types';

const VALID_TAGS: TagType[] = ['苦痛', '違和感', '欲求', '気づき', '閃き', '兆し', '夢'];

export async function createMemoAction(formData: FormData) {
  const rawTag = String(formData.get('tag') ?? '');
  const content = String(formData.get('content') ?? '').trim();

  if (!VALID_TAGS.includes(rawTag as TagType) || !content) {
    throw new Error('入力が不正です');
  }

  const userId = getCurrentUserId();
  const hashtags = extractHashtags(content);

  const rows = await sql`
    INSERT INTO memos (user_id, content, tag, hashtags)
    VALUES (${userId}, ${content}, ${rawTag}, ${hashtags})
    RETURNING id
  ` as Array<{ id: string }>;

  const id = rows[0]?.id;
  if (!id) throw new Error('保存に失敗しました');

  revalidatePath('/board');
  redirect(`/memo/${id}`);
}

export async function getMemoById(id: string): Promise<Memo | null> {
  const userId = getCurrentUserId();
  const rows = await sql`
    SELECT id, user_id, content, tag, hashtags, created_at, updated_at
    FROM memos
    WHERE id = ${id} AND user_id = ${userId}
    LIMIT 1
  ` as Memo[];
  return rows[0] ?? null;
}

export async function getRelatedMemos(memo: Memo, limit = 5): Promise<Pick<Memo, 'id' | 'content' | 'created_at'>[]> {
  const userId = getCurrentUserId();
  return await sql`
    SELECT id, content, created_at
    FROM memos
    WHERE user_id = ${userId}
      AND id != ${memo.id}
      AND (tag = ${memo.tag} OR hashtags && ${memo.hashtags})
    ORDER BY created_at DESC
    LIMIT ${limit}
  ` as Pick<Memo, 'id' | 'content' | 'created_at'>[];
}

export async function getMemosByTag(tag: TagType, limit = 30): Promise<Memo[]> {
  const userId = getCurrentUserId();
  return await sql`
    SELECT id, user_id, content, tag, hashtags, created_at, updated_at
    FROM memos
    WHERE user_id = ${userId} AND tag = ${tag}
    ORDER BY created_at DESC
    LIMIT ${limit}
  ` as Memo[];
}

type BoardRow = {
  tag: TagType;
  memo_count: number;
  latest_at: string;
  excerpts: string[];
  ideated_memo_count: number;
  recent_memos: Memo[];
};

export async function getBoardData(
  sort: 'hot' | 'new' | 'sleeping' = 'hot'
): Promise<ThemeCard[]> {
  const userId = getCurrentUserId();

  const aggregates = await sql`
    SELECT
      m.tag,
      COUNT(*)::int AS memo_count,
      MAX(m.created_at) AS latest_at,
      (
        SELECT COALESCE(array_agg(content ORDER BY created_at DESC), '{}')
        FROM (
          SELECT content, created_at
          FROM memos m2
          WHERE m2.user_id = m.user_id AND m2.tag = m.tag
          ORDER BY created_at DESC
          LIMIT 3
        ) t
      ) AS excerpts,
      (
        SELECT COUNT(DISTINCT i.memo_id)::int
        FROM ideas i
        WHERE i.memo_id IN (SELECT id FROM memos m3 WHERE m3.user_id = m.user_id AND m3.tag = m.tag)
      ) AS ideated_memo_count
    FROM memos m
    WHERE m.user_id = ${userId}
    GROUP BY m.tag, m.user_id
  ` as BoardRow[];

  const cards: ThemeCard[] = [];
  for (const row of aggregates) {
    const memos = await getMemosByTag(row.tag);
    const temperature = judgeTemperature(memos);
    cards.push({
      tag: row.tag,
      memo_count: row.memo_count,
      latest_at: row.latest_at,
      excerpts: row.excerpts ?? [],
      temperature,
      ideated_memo_count: row.ideated_memo_count,
    });
  }

  return sortThemeCards(cards, sort);
}

function sortThemeCards(cards: ThemeCard[], sort: 'hot' | 'new' | 'sleeping'): ThemeCard[] {
  const tempOrder: Record<Temperature, number> = { rising: 0, building: 1, sleeping: 2 };
  if (sort === 'hot') {
    return [...cards].sort((a, b) => {
      const cmp = tempOrder[a.temperature] - tempOrder[b.temperature];
      if (cmp !== 0) return cmp;
      return new Date(b.latest_at).getTime() - new Date(a.latest_at).getTime();
    });
  }
  if (sort === 'sleeping') {
    return [...cards].sort((a, b) => {
      const cmp = tempOrder[b.temperature] - tempOrder[a.temperature];
      if (cmp !== 0) return cmp;
      return new Date(a.latest_at).getTime() - new Date(b.latest_at).getTime();
    });
  }
  return [...cards].sort(
    (a, b) => new Date(b.latest_at).getTime() - new Date(a.latest_at).getTime()
  );
}
