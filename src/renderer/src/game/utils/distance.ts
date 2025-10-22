export function getDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function getVelocityCoords(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  speed: number
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = getDistance(x1, y1, x2, y2) || 1;

  const vx = (dx / len) * speed;
  const vy = (dy / len) * speed;
  return { vx, vy };
}
