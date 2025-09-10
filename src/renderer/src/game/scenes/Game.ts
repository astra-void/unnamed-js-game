import { Knife } from '../entities/item/weapons';
import { Player } from '../entities/living/Player';
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  gameText: Phaser.GameObjects.Text;
  player: Player;
  projectiles: Phaser.GameObjects.Group;

  constructor() {
    super('Game');
  }

  preload() {
    this.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillCircle(8, 8, 8)
      .generateTexture('player', 16, 16)
      .destroy();
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x000000);

    this.projectiles = this.add.group();

    this.player = new Player(this, 512, 384, 100, 200, 0, 1, [
      new Knife(this, this.player)
    ]);

    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

    EventBus.emit('current-scene-ready', this);
  }

  update(time: number, delta: number): void {
    this.player.update(time, delta);

    this.projectiles.getChildren().forEach((proj) => {
      if (proj.update) proj.update(time, delta);
    })
  }

  changeScene() {
    this.scene.start('GameOver');
  }
}
