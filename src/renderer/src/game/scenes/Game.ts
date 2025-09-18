import { Knife } from '../weapons';
import { Player } from '../entities/living/Player';
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { UIManager } from '../managers/UIManager';
import { EnemyManager } from '../managers/EnemyManager';
import { ProjectileManager } from '../managers/ProjectileManager';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  gameText: Phaser.GameObjects.Text;
  player: Player;
  enemyManager: EnemyManager;
  projectileManager: ProjectileManager;

  declare uiManager: UIManager;

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

    this.uiManager = new UIManager(this);

    this.player = new Player(this, 512, 384, 100, 0, 1, [], []);
    this.player.weapons.push(new Knife(this, this.player));

    this.enemyManager = new EnemyManager(this);
    this.projectileManager = new ProjectileManager(this);

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
  }

  togglePause() {
    this.paused = !this.paused;

    if (this.paused) {
      this.physics.world.pause();
    } else {
      this.physics.world.resume();
    }
  }

  shutdown() {
    if (this.enemyManager) this.enemyManager.destroy();
    if (this.projectileManager) this.projectileManager.destroy();
  }
}
