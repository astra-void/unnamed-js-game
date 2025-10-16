import { Scene } from 'phaser';
import { FUSION_RECIPES } from '../constants/FusionRecipes';
import { EventBus } from '../EventBus';
import { Player } from '../entities/living/Player';
import { FusionManager } from '../fusion';
import { EnemyManager } from '../managers/EnemyManager';
import { InstanceManager } from '../managers/InstanceManager';
import { ProjectileManager } from '../managers/ProjectileManager';
import { UIManager } from '../managers/UIManager';
import { Knife } from '../weapons';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  gameText: Phaser.GameObjects.Text;
  player: Player;

  enemyManager: EnemyManager;
  projectileManager: ProjectileManager;
  fusionManager: FusionManager;
  uiManager: UIManager;
  instanceManager: InstanceManager;

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
    this.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRect(6, 6, 64, 64)
      .generateTexture('test_object', 128, 128)
      .destroy();
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
    this.player.weaponManager.add(new Knife(this, this.player)); // PLACEHOLDER
    this.player.weaponManager.weapons.forEach((w) => w.levelUp(this.player)); // PLACEHOLDER

    this.enemyManager = new EnemyManager(this);
    this.projectileManager = new ProjectileManager(this);
    this.fusionManager = new FusionManager(this.player, FUSION_RECIPES);
    this.instanceManager = new InstanceManager(this);

    this.instanceManager.add(this.add.sprite(100, 100, 'test_object'), 'test'); // PLACEHOLDER

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
