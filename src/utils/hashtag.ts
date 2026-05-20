export function extractHashtags(content: string): string[] {
  const regex = /#([一-龯ぁ-んァ-ヶa-zA-Z0-9_]+)/g;
  return [...new Set(Array.from(content.matchAll(regex), (m) => m[1]))];
}
