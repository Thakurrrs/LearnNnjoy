export type StarPosition = { x: number; y: number };

// Percent coordinates in a 0-100 × 0-100 space. The trail walks left to
// right with a gentle sine wave so sequential topics read as one path.
export function getTrailPositions(count: number): StarPosition[] {
  if (count <= 0) return [];
  return Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0 : index / (count - 1);
    return {
      x: Math.round((6 + t * 88) * 10) / 10,
      y: Math.round((45 + 27 * Math.sin(index * 1.15)) * 10) / 10,
    };
  });
}
