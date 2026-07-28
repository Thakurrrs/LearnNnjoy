export const CRICKET_PLAYERS = [
  { name: "Asha", score: 42 },
  { name: "Kabir", score: 37 },
  { name: "Noor", score: 35 },
  { name: "Ira", score: 21 },
] as const;

export function balanceEquation(removed: number) {
  const safeRemoved = Math.max(0, Math.min(5, Math.floor(removed)));
  return {
    leftBlocks: 5 - safeRemoved,
    rightBlocks: 12 - safeRemoved,
    mysteryValue: 7,
  };
}

export function shopSaving(price: number, discount: number) {
  return price * discount / 100;
}

export function shopFinalPrice(price: number, discount: number) {
  return price - shopSaving(price, discount);
}

export function skateSkaterAlong(angle: number) {
  return Math.max(16, 82 - angle * 0.5);
}

export function triangleMissingAngle(first: number, second: number) {
  return 180 - first - second;
}

export function topCricketPlayers(count: number) {
  return [...CRICKET_PLAYERS]
    .sort((first, second) => second.score - first.score)
    .slice(0, Math.max(0, count))
    .map((player) => player.name);
}
