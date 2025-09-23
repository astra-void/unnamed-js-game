import { Game } from '../scenes/Game';
import { isEnemySprite, isProjectileSprite } from '../types/typeGuards';

export class ProjectileManager {
  private scene: Game;
  private projectiles: Phaser.GameObjects.Group;

  constructor(scene: Game) {
    this.scene = scene;
    this.projectiles = scene.add.group({
      runChildUpdate: false
    });

    scene.physics.add.overlap(
      this.projectiles,
      scene.enemyManager.enemiesGroup,
      (projSprite, enemySprite) => {
        if (!isProjectileSprite(projSprite) || !isEnemySprite(enemySprite))
          return;

        const projectile = projSprite.entity;
        const enemy = enemySprite.entity;

        projectile.onHit(enemy);
        enemy.healthManager.takeDamage(projectile.damage);

        projectile.destroy();
      }
    );
  }

  get projectileCount() {
    return this.projectiles.children.size;
  }

  add(sprite: Phaser.GameObjects.Sprite) {
    this.projectiles.add(sprite);
  }

  update(time: number, delta: number) {
    this.projectiles.getChildren().forEach((proj: unknown) => {
      if (isProjectileSprite(proj)) {
        proj.entity.update(time, delta);
      }
    });
  }

  clear() {
    this.projectiles.children.each((sprite: unknown) => {
      if (!isProjectileSprite(sprite)) return false;

      const projectile = sprite.entity;
      projectile.destroy();
      return true;
    });

    this.projectiles.clear(true, true);
  }

  destroy() {
    this.clear();
    this.projectiles.destroy();
  }
}
