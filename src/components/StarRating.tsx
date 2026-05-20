import { getStars } from '@/utils/score';

export function StarRating({ count }: { count: number }) {
  const stars = getStars(count);
  return (
    <span className="inline-flex items-center gap-0.5 text-[#B8860B]" aria-label={`スコア ${stars}`}>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={n <= stars ? 'text-[#B8860B]' : 'text-[#B8860B]/25'}
          aria-hidden
        >
          ★
        </span>
      ))}
    </span>
  );
}
