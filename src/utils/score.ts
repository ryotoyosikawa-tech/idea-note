export function getStars(interestCount: number): 1 | 2 | 3 {
  if (interestCount >= 6) return 3;
  if (interestCount >= 3) return 2;
  return 1;
}
