import type { Entity } from "../entities/Entity";

/**
 * 대충 두 엔티티 사이 거리 구하는 함수
 */
export function distance(a: Entity, b: Entity) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}