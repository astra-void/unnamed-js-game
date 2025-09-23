import { Game } from '../scenes/Game';
import { Enemy } from '../entities/living/Enemy';
import Phaser from 'phaser';
import { GAME_CONFIG } from '../constants';
import { EnemySprite, isEnemySprite } from '../types/typeGuards';
import { EventBus } from '../EventBus';

export class EnemyManager {
  private scene: Game;
  private spawnTimer: Phaser.Time.TimerEvent | null = null;
  private spawnInterval: number;
  private enemies: Phaser.GameObjects.Group;
  wave: number = 1;

  constructor(scene: Game) {
    this.scene = scene;
    this.enemies = scene.add.group({
      runChildUpdate: false
    });

    this.spawnInterval = GAME_CONFIG.ENEMY.SPAWN_INTERVAL;

    scene.physics.add.overlap(
      scene.player.sprite,
      this.enemies,
      (_playerSprite: unknown, enemySprite: unknown) => {
        if (!isEnemySprite(enemySprite)) return;
        const enemy = enemySprite.entity;
        scene.player.healthManager.takeDamage(enemy.damage);
        enemy.healthManager.takeDamage(enemy.healthManager.maxHp);
      }
    );

    EventBus.on('enemyManager:waveUp', () => {
      this.waveUp();
    });

    EventBus.on('enemyManager:waveDown', () => {
      this.waveDown();
    });
  }

  get enemiesGroup() {
    return this.enemies;
  }

  get enemyCount() {
    return this.enemies.children.size;
  }

  waveUp() {
    this.wave++;
    this.updateSpawnInterval();
    this.updateSpawnTimer();
  }

  waveDown() {
    this.wave--;
    this.updateSpawnInterval();
    this.updateSpawnTimer();
  }

  private updateSpawnInterval() {
    if (this.wave % 5 === 0) {
      this.spawnInterval = GAME_CONFIG.ENEMY.SPAWN_INTERVAL;
    } else {
      this.spawnInterval = Math.max(
        GAME_CONFIG.ENEMY.SPAWN_INTERVAL / this.wave,
        GAME_CONFIG.ENEMY.MIN_SPAWN_INTERVAL
      );
    }
  }

  private updateSpawnTimer() {
    if (this.spawnTimer) {
      this.stopSpawning();
      this.startSpawning();
    }
  }

  startSpawning() {
    if (this.spawnTimer) return;

    this.spawnTimer = this.scene.time.addEvent({
      delay: this.spawnInterval,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });
  }

  stopSpawning() {
    if (this.spawnTimer) {
      this.spawnTimer.remove();
      this.spawnTimer = null;
    }
  }

  update(time: number, delta: number) {
    this.enemies.children.each((enemySprite: unknown) => {
      if (!isEnemySprite(enemySprite)) return false;
      const enemy = enemySprite.entity;
      if (enemy) enemy.update(time, delta);
      return true;
    }, this);
  }

  spawnEnemy() {
    if (this.scene.paused) return;

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
