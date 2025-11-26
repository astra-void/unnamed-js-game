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
      'healing_chocolate',
      (g) => g.fillStyle(0x00ffff, 1).fillCircle(6, 6, 4),
      12,
      12
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