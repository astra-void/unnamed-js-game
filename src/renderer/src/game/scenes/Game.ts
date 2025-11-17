import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { Player } from '../entities/living/Player';
import { EnemyManager } from '../managers/EnemyManager';
import { InstanceManager } from '../managers/InstanceManager';
import { ProjectileManager } from '../managers/ProjectileManager';
import { UIManager } from '../managers/UIManager';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  gameText: Phaser.GameObjects.Text;
  player: Player;

  enemyManager: EnemyManager;
  projectileManager: ProjectileManager;
  uiManager: UIManager;
  instanceManager: InstanceManager;

  paused: boolean = false;

  constructor() {
    super('Game');
  }

  preload() {
    const ensureTexture = (
      key: string,
      drawer: (graphics: Phaser.GameObjects.Graphics) => void,
      width: number = 64,
      height: number = 64
    ) => {
      if (this.textures.exists(key)) return;

      const graphics = this.add.graphics();
      drawer(graphics);
      graphics.generateTexture(key, width, height);
      graphics.destroy();
    };

    /** Placeholder test graphics */
    ensureTexture(
      'player',
      (g) => g.fillStyle(0xffffff).fillCircle(8, 8, 8),
      16,
      16
    );
    ensureTexture(
      'enemy',
      (g) => g.fillStyle(0xff0000).fillCircle(8, 8, 8),
      16,
      16
    );
    ensureTexture(
      'projectile',
      (g) => g.fillStyle(0x00ff00, 0.7).fillCircle(6, 6, 6),
      12,
      12
    );
    ensureTexture(
      'test_object',
      (g) => g.fillStyle(0xffffff).fillRect(0, 0, 64, 64),
      64,
      64
    );

    ensureTexture(
      'arrow',
      (g) =>
        g
          .fillStyle(0xf5deb3)
          .fillRect(20, 28, 24, 8)
          .fillTriangle(10, 16, 10, 48, 32, 32),
      64,
      64
    );
    ensureTexture(
      'arrow_projectile',
      (g) => g.fillStyle(0xf5deb3).fillTriangle(2, 6, 10, 0, 10, 12),
      12,
      12
    );
    ensureTexture(
      'jelly_bombard',
      (g) =>
        g
          .fillStyle(0x8a2be2)
          .fillCircle(32, 32, 18)
          .lineStyle(4, 0xffffff)
          .strokeCircle(32, 32, 22),
      64,
      64
    );
    ensureTexture(
      'jelly_flame',
      (g) =>
        g
          .fillStyle(0xff7f50)
          .fillCircle(32, 42, 14)
          .fillTriangle(32, 8, 18, 42, 46, 42),
      64,
      64
    );
    ensureTexture(
      'jelly_crossbow',
      (g) =>
        g
          .fillStyle(0xdeb887)
          .fillRect(14, 28, 36, 8)
          .lineStyle(4, 0x8b4513)
          .strokeTriangle(10, 24, 10, 40, 28, 32)
          .strokeTriangle(54, 24, 54, 40, 36, 32),
      64,
      64
    );
    ensureTexture(
      'jelly_crown_icon',
      (g) => g.fillStyle(0xffd700).fillTriangle(8, 48, 32, 12, 56, 48),
      64,
      64
    );
    ensureTexture(
      'milk_sprayer',
      (g) => g.fillStyle(0xffffff).fillRoundedRect(12, 12, 40, 40, 8),
      64,
      64
    );
    ensureTexture(
      'morning_star',
      (g) =>
        g
          .fillStyle(0xc0c0c0)
          .fillCircle(18, 32, 8)
          .fillCircle(46, 32, 12)
          .lineStyle(3, 0x444444)
          .strokeCircle(46, 32, 16),
      64,
      64
    );
    ensureTexture(
      'gummy_soul',
      (g) => g.fillStyle(0x98fb98).fillCircle(32, 32, 18),
      64,
      64
    );
    ensureTexture(
      'gummy_staff',
      (g) =>
        g
          .fillStyle(0x8b4513)
          .fillRect(28, 12, 8, 40)
          .fillStyle(0x98fb98)
          .fillCircle(32, 12, 8),
      64,
      64
    );
    ensureTexture(
      'scythe',
      (g) =>
        g
          .fillStyle(0x696969)
          .fillRect(30, 12, 6, 40)
          .fillStyle(0xc0c0c0)
          .fillCircle(20, 16, 10)
          .fillRect(12, 8, 12, 16),
      64,
      64
    );
    ensureTexture(
      'choco_chip_icon',
      (g) =>
        g
          .fillStyle(0x8b4513)
          .fillCircle(32, 32, 20)
          .fillStyle(0x5d3412)
          .fillCircle(24, 26, 4)
          .fillCircle(40, 38, 3)
          .fillCircle(36, 24, 3),
      64,
      64
    );
    ensureTexture(
      'cream_cloak_icon',
      (g) =>
        g
          .fillStyle(0xfffdd0)
          .fillRoundedRect(10, 10, 44, 44, 12)
          .lineStyle(3, 0xffd700)
          .strokeRoundedRect(10, 10, 44, 44, 12),
      64,
      64
    );

    /** End of placeholder test graphics */
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x000000);

    this.uiManager = new UIManager(this);

    this.player = new Player(
      this,
      import.meta.env.VITE_WIDTH / 2,
      import.meta.env.VITE_HEIGHT / 2
    );

    this.enemyManager = new EnemyManager(this);
    this.projectileManager = new ProjectileManager(this);
    this.instanceManager = new InstanceManager(this);

    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

    this.enemyManager.startSpawning();

    EventBus.emit('current-scene-ready', this);
  }

  update(time: number, delta: number): void {
    if (this.paused) return;

    this.uiManager.update(time, delta);
    this.player.update(time, delta);

    this.enemyManager.update(time, delta);
    this.projectileManager.update(time, delta);
    this.instanceManager.update(time, delta);
  }

  pauseGame() {
    if (this.paused) return;
    this.paused = true;
    this.physics.world.pause();
  }

  resumeGame() {
    if (!this.paused) return;
    this.paused = false;
    this.physics.world.resume();
  }

  shutdown() {
    if (this.enemyManager) this.enemyManager.destroy();
    if (this.projectileManager) this.projectileManager.destroy();
    this.game.events.shutdown();
  }
}
