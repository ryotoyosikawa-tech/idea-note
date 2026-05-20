'use server';

import { sql } from '@/lib/db';
import { getCurrentUserId } from '@/lib/user';
import { revalidatePath } from 'next/cache';
import type { Idea, IdeaCategory } from '@/types';

type GeneratedIdea = {
  category: IdeaCategory;
  title: string;
  niche_description: string;
  business_model: string;
  search_sources?: string[];
};

async function callVertex(memo: { tag: string; content: string }, model?: string): Promise<GeneratedIdea[]> {
  const base = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const res = await fetch(`${base}/api/generate-ideas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memo, model }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`generate-ideas failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.ideas as GeneratedIdea[];
}

export async function generateIdeasForMemo(memoId: string, model?: string) {
  const userId = getCurrentUserId();

  const memoRows = await sql`
    SELECT id, content, tag FROM memos WHERE id = ${memoId} AND user_id = ${userId} LIMIT 1
  ` as Array<{ id: string; content: string; tag: string }>;

  if (memoRows.length === 0) throw new Error('メモが見つかりません');
  const memo = memoRows[0];

  const ideas = await callVertex(memo, model);
  if (!Array.isArray(ideas) || ideas.length === 0) {
    throw new Error('AIからアイデアを取得できませんでした');
  }

  const batchRows = await sql`SELECT gen_random_uuid() AS id` as Array<{ id: string }>;
  const batchId = batchRows[0].id;

  for (const idea of ideas) {
    await sql`
      INSERT INTO ideas (
        user_id, memo_id, generation_batch_id, category, title,
        niche_description, business_model, search_sources
      ) VALUES (
        ${userId}, ${memoId}, ${batchId}, ${idea.category}, ${idea.title},
        ${idea.niche_description}, ${idea.business_model}, ${idea.search_sources ?? []}
      )
    `;
  }

  revalidatePath(`/memo/${memoId}`);
  revalidatePath(`/memo/${memoId}/ideas`);
  return { batchId };
}

export async function getIdeasForMemo(memoId: string): Promise<Idea[]> {
  const userId = getCurrentUserId();
  return await sql`
    SELECT * FROM ideas
    WHERE memo_id = ${memoId} AND user_id = ${userId}
    ORDER BY created_at DESC, category ASC
  ` as Idea[];
}

export async function evaluateIdeaAction(formData: FormData) {
  const ideaId = String(formData.get('ideaId') ?? '');
  const status = String(formData.get('status') ?? '');
  if (!ideaId || !['interested', 'meh'].includes(status)) {
    throw new Error('invalid input');
  }

  const userId = getCurrentUserId();

  if (status === 'interested') {
    await sql`
      INSERT INTO idea_evaluations (user_id, idea_id, status, interest_count)
      VALUES (${userId}, ${ideaId}, 'interested', 1)
      ON CONFLICT (user_id, idea_id)
      DO UPDATE SET
        status = 'interested',
        interest_count = idea_evaluations.interest_count + 1,
        updated_at = now()
    `;
  } else {
    await sql`
      INSERT INTO idea_evaluations (user_id, idea_id, status, interest_count)
      VALUES (${userId}, ${ideaId}, 'meh', 0)
      ON CONFLICT (user_id, idea_id)
      DO UPDATE SET
        status = 'meh',
        updated_at = now()
    `;
  }

  revalidatePath('/ideas');
}

export type EvaluatedIdea = Idea & {
  interest_count: number;
  status: 'interested' | 'meh' | null;
  source_memo_content: string;
  source_memo_tag: string;
};

export async function getInterestedIdeas(
  sort: 'interest' | 'new' | 'category' = 'interest',
  categoryFilter: IdeaCategory | 'all' = 'all'
): Promise<EvaluatedIdea[]> {
  const userId = getCurrentUserId();

  const rows = await sql`
    SELECT
      i.*,
      e.interest_count,
      e.status,
      e.updated_at AS evaluated_at,
      m.content AS source_memo_content,
      m.tag AS source_memo_tag
    FROM ideas i
    INNER JOIN idea_evaluations e ON i.id = e.idea_id AND e.user_id = i.user_id
    INNER JOIN memos m ON i.memo_id = m.id
    WHERE i.user_id = ${userId} AND e.status = 'interested'
  ` as EvaluatedIdea[];

  const filtered = categoryFilter === 'all' ? rows : rows.filter((r) => r.category === categoryFilter);

  if (sort === 'interest') {
    return [...filtered].sort((a, b) => b.interest_count - a.interest_count);
  }
  if (sort === 'category') {
    const order: Record<IdeaCategory, number> = { saas: 0, product: 1, service: 2 };
    return [...filtered].sort((a, b) => order[a.category] - order[b.category]);
  }
  return [...filtered].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getIdeaEvaluations(
  ideaIds: string[]
): Promise<Map<string, { status: string | null; interest_count: number }>> {
  if (ideaIds.length === 0) return new Map();
  const userId = getCurrentUserId();
  const rows = await sql`
    SELECT idea_id, status, interest_count
    FROM idea_evaluations
    WHERE user_id = ${userId} AND idea_id = ANY(${ideaIds})
  ` as Array<{ idea_id: string; status: string | null; interest_count: number }>;
  const map = new Map<string, { status: string | null; interest_count: number }>();
  for (const r of rows) {
    map.set(r.idea_id, { status: r.status, interest_count: r.interest_count });
  }
  return map;
}
