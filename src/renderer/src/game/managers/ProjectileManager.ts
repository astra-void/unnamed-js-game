import { Enemy } from '../entities/living';
import { Projectile } from '../entities/projectiles';
import { Game } from '../scenes/Game';

type ProjectileSprite = Phaser.GameObjects.Sprite & { entity: Projectile };
type EnemySprite = Phaser.GameObjects.Sprite & { entity: Enemy };

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
        const projectile = (projSprite as ProjectileSprite).entity;
        const enemy = (enemySprite as EnemySprite).entity;

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
      if (proj instanceof Projectile) proj.update(time, delta);
    });
  }

  clear() {
    this.projectiles.children.each((sprite: unknown) => {
      const projectile = (sprite as ProjectileSprite).entity;
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
