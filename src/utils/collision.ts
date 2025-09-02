import type { Player, Enemy } from "../entities";

export function checkCollision(a: Player, b: Enemy) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dist = Math.hypot(dx, dy);
  
  return dist < a.radius + b.radius;
}