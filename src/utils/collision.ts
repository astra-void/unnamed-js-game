import type { Player, Enemy } from "../entities";

/**
 * 대충 적이랑 플레이어 충돌했는지 확인하는 함수
 * @returns {boolean}
 */
export function checkCollision(a: Player, b: Enemy): boolean {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dist = Math.hypot(dx, dy);
  
  return dist < a.radius + b.radius;
}