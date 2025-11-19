import { Enemy } from '../entities/living/Enemy';
import { Projectile } from '../projectiles';

export type EnemySprite = Phaser.GameObjects.Sprite & { entity: Enemy };

export type ProjectileSprite = Phaser.GameObjects.Sprite & {
  entity: Projectile;
};

export function isEnemySprite(sprite: unknown): sprite is EnemySprite {
  return (sprite as EnemySprite).entity instanceof Enemy;
}

export function isProjectileSprite(
  sprite: unknown
): sprite is ProjectileSprite {
  return (sprite as ProjectileSprite).entity instanceof Projectile;
}

export function isSprite(
  sprite: unknown
): sprite is EnemySprite | ProjectileSprite {
  const entity = (sprite as EnemySprite | ProjectileSprite).entity;
  return entity instanceof Enemy || entity instanceof Projectile;
}
