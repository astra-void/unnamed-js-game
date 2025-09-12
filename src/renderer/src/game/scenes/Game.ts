/* eslint-disable @typescript-eslint/no-explicit-any */
import { Knife } from '../weapons';
import { Enemy } from '../entities/living/Enemy';
import { Player } from '../entities/living/Player';
import { Projectile } from '../entities/projectiles/Projectile';
import { EventBus } from '../EventBus';
import { Math, Scene } from 'phaser';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  gameText: Phaser.GameObjects.Text;
  player: Player;
  enemies: Phaser.GameObjects.Group;
  projectiles: Phaser.GameObjects.Group;

  spawnTimer: number = 0;
  spawnInterval: number = 2000;

  paused: boolean = false;

  constructor() {
    super('Game');
  }

  preload() {
    /** Placeholder test graphics */
    this.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillCircle(8, 8, 8)
      .generateTexture('player', 16, 16)
      .destroy();
    this.add
      .graphics()
      .fillStyle(0xff0000, 1)
      .fillCircle(8, 8, 8)
      .generateTexture('enemy', 16, 16)
      .destroy();
    this.add
      .graphics()
      .fillStyle(0xffffff, 0.5)
      .fillCircle(6, 6, 6)
      .generateTexture('knife_projectile', 12, 12)
      .destroy();
    this.add
      .graphics()
      .fillStyle(0x00ff00, 0.5)
      .fillCircle(6, 6, 6)
      .generateTexture('projectile', 12, 12)
      .destroy();
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x000000);

    this.enemies = this.add.group();
    this.projectiles = this.add.group();

    this.player = new Player(this, 512, 384, 100, 200, 0, 1, []);
    this.player.weapons.push(new Knife(this, this.player));

    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

    this.physics.add.overlap(
      this.player.sprite,
      this.enemies,
      (_playerSprite, enemySprite) => {
        const enemy = (enemySprite as any).entity as Enemy;
        this.player.takeDamage(enemy.damage);
        enemy.takeDamage(enemy.maxHp);
      }
    );

    this.physics.add.overlap(
      this.projectiles,
      this.enemies,
      (projSprite, enemySprite) => {
        const projectile = (
          projSprite as Phaser.GameObjects.Sprite & { entity: Projectile }
        ).entity;
        const enemy = (
          enemySprite as Phaser.GameObjects.Sprite & { entity: Enemy }
        ).entity;

        projectile.onHit(enemy);
        enemy.takeDamage(projectile.damage);

        projectile.destroy();
      }
    );

    EventBus.emit('current-scene-ready', this);
  }

  update(time: number, delta: number): void {
    if (this.paused) return;

    this.player.update(time, delta);

    this.spawnTimer += delta;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnEnemy();
    }

    this.enemies.getChildren().forEach((enemySprite) => {
      const enemy = (enemySprite as any).entity as Enemy;
      enemy.update(time, delta);
    });

    this.projectiles.getChildren().forEach((proj) => {
      if (proj.update) proj.update(time, delta);
    });
  }

  spawnEnemy() {
    const side = Math.Between(0, 3);
    let x = 0;
    let y = 0;

    switch (side) {
      case 0: // 위
        x = Phaser.Math.Between(0, this.scale.width);
        y = 0;
        break;
      case 1: // 아래
        x = Phaser.Math.Between(0, this.scale.width);
        y = this.scale.height;
        break;
      case 2: // 왼쪽
        x = 0;
        y = Phaser.Math.Between(0, this.scale.height);
        break;
      case 3: // 오른쪽
        x = this.scale.width;
        y = Phaser.Math.Between(0, this.scale.height);
        break;
    }

    const enemy = new Enemy(this, x, y, 100, 10, 200, this.player);
    (enemy.sprite as any).entity = enemy;
    this.enemies.add(enemy.sprite);
  }

  togglePuase() {
    this.paused = !this.paused;

    if (this.paused) {
      this.physics.world.pause();
    } else {
      this.physics.world.resume();
    }
  }
}
