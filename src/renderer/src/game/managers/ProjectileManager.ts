import { Game } from '../scenes/Game';
import { isEnemySprite, isProjectileSprite } from '../types/typeGuards';

export class ProjectileManager {
  scene: Game;
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
    return this.projectiles.getLength();
  }

  add(sprite: Phaser.GameObjects.Sprite) {
    this.projectiles.add(sprite);
  }

  update(time: number, delta: number) {
    this.projectiles.getChildren().forEach((proj: unknown) => {
      if (!isProjectileSprite(proj)) return;

      const projectile = proj.entity;

      if (projectile.destroyed) {
        this.projectiles.remove(proj, true, true);
        return;
      }

      projectile.update(time, delta);
    });
  }

  clear() {
    this.projectiles.getChildren().forEach((proj: unknown) => {
      if (!isProjectileSprite(proj)) return;

      this.projectiles.remove(proj, true, true);
    });

    this.projectiles.clear(false, false);
  }

  destroy() {
    this.clear();
    this.projectiles.destroy(true);
  }
}
