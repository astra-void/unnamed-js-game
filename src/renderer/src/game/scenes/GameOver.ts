import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameOverText: Phaser.GameObjects.Text;
  survivedTimeText?: Phaser.GameObjects.Text;

  constructor() {
    super('GameOver');
  }

  create(data: { survivedTime?: number } = {}) {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x000000);

    this.background = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      'background'
    );
    this.background.setAlpha(0.5);

    this.gameOverText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 40,
      'you died bruh so suck',
      {
        fontFamily: 'Arial',
        fontSize: 64,
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center'
      }
    );
    this.gameOverText.setOrigin(0.5).setDepth(100);

    const survivedSeconds = Math.max(0, Math.floor(data.survivedTime ?? 0));
    const minutes = Math.floor(survivedSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (survivedSeconds % 60).toString().padStart(2, '0');

    this.survivedTimeText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 20,
      `you survived: ${minutes}:${seconds}`,
      {
        fontFamily: 'Arial',
        fontSize: 32,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
        align: 'center'
      }
    );
    this.survivedTimeText.setOrigin(0.5).setDepth(100);

    EventBus.emit('current-scene-ready', this);
  }

  changeScene() {
    this.scene.start('MainMenu');
  }
}
