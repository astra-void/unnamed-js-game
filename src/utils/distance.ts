import type { Entity } from "../entities/Entity";

export function distance(a: Entity, b: Entity) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}