import { Entity } from '../entities/Entity';
import { Enemy } from '../entities/living/Enemy';
import { Projectile } from '../projectiles';

export type EnemySprite = Phaser.GameObjects.Sprite & { entity: Enemy };

export type ProjectileSprite = Phaser.GameObjects.Sprite & {
  entity: Projectile;
};

export type EntitySprite = Phaser.GameObjects.Sprite & { entity: Entity };

export function isEnemySprite(sprite: unknown): sprite is EnemySprite {
  return (sprite as EnemySprite).entity instanceof Enemy;
}

export function isProjectileSprite(
  sprite: unknown
): sprite is ProjectileSprite {
  return (sprite as ProjectileSprite).entity instanceof Projectile;
}

export function isEntitySprite(sprite: unknown): sprite is EntitySprite {
  return (sprite as EntitySprite).entity instanceof Entity;
}

export function isSprite(
  sprite: unknown
): sprite is EnemySprite | ProjectileSprite | EntitySprite {
  const entity = (sprite as EnemySprite | ProjectileSprite | EntitySprite)
    .entity;
  return (
    entity instanceof Enemy ||
    entity instanceof Projectile ||
    entity instanceof Entity
  );
}
