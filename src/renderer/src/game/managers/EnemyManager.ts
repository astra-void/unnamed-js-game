import { Game } from '../scenes/Game';
import { Enemy } from '../entities/living/Enemy';
import Phaser from 'phaser';

type EnemySprite = Phaser.GameObjects.Sprite & { entity: Enemy };

export class EnemyManager {
  private scene: Game;
  private spawnTimer: Phaser.Time.TimerEvent | null = null;
  private spawnInterval: number = 2000;
  private enemies: Phaser.GameObjects.Group;

  constructor(scene: Game) {
    this.scene = scene;
    this.enemies = scene.add.group({
      runChildUpdate: false
    });

    scene.physics.add.overlap(
      scene.player.sprite,
      this.enemies,
      (_playerSprite: unknown, enemySprite: unknown) => {
        const enemy = (enemySprite as EnemySprite).entity;
        scene.player.takeDamage(enemy.damage);
        enemy.takeDamage(enemy.maxHp);
      }
    );
  }

  get enemiesGroup() {
    return this.enemies;
  }

  get enemyCount() {
    return this.enemies.children.size;
  }

  startSpawning() {
    this.spawnTimer = this.scene.time.addEvent({
      delay: this.spawnInterval,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });
  }

  stopSpawning() {
    if (this.spawnTimer) this.spawnTimer.remove();
  }

  update(time: number, delta: number) {
    this.enemies.children.each((enemySprite: unknown) => {
      const enemy = (enemySprite as EnemySprite).entity;
      if (enemy) enemy.update(time, delta);
      return true;
    }, this);
  }

  spawnEnemy() {
    const side = Phaser.Math.Between(0, 3);
    let x = 0;
    let y = 0;

    switch (side) {
      case 0: // 위
        x = Phaser.Math.Between(0, this.scene.scale.width);
        y = 0;
        break;
      case 1: // 아래
        x = Phaser.Math.Between(0, this.scene.scale.width);
        y = this.scene.scale.height;
        break;
      case 2: // 왼쪽
        x = 0;
        y = Phaser.Math.Between(0, this.scene.scale.height);
        break;
      case 3: // 오른쪽
        x = this.scene.scale.width;
        y = Phaser.Math.Between(0, this.scene.scale.height);
        break;
    }

    const enemy = new Enemy(this.scene, x, y, 100, 10, 200, this.scene.player);
    (enemy.sprite as EnemySprite).entity = enemy;
    this.enemies.add(enemy.sprite);
  }

  clear() {
    this.enemies.children.each((sprite: unknown) => {
      const enemySprite = sprite as EnemySprite;
      if (enemySprite.entity) {
        enemySprite.entity.destroy();
      }
      return true;
    });

    this.enemies.clear(true, true);
    this.stopSpawning();
  }

  destroy() {
    this.clear();
    this.enemies.destroy();
  }
}
