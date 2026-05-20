import { WriteForm } from '@/components/WriteForm';
import { ALL_TAGS } from '@/lib/theme';
import type { TagType } from '@/types';

type Search = { tag?: string };

export default async function WritePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const requested = sp.tag as TagType | undefined;
  const initialTag: TagType =
    requested && (ALL_TAGS as readonly string[]).includes(requested)
      ? requested
      : '気づき';

  return <WriteForm initialTag={initialTag} />;
}
