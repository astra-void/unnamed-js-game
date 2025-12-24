import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameOverText: Phaser.GameObjects.Text;
  survivedTimeText?: Phaser.GameObjects.Text;

  private hsv: Phaser.Types.Display.ColorObject[];
  private i: number = 0;

  /*
  private insults: string[] = [
    'you died bruh so suck',
    'loser! try harder scrub',
    'git gud or quit noob',
    'pathetic! you blow',
    'ha ha you fail again',
    'weak sauce, give up',
    'total trash player',
    'die more why dontcha',
    'youre the worst ever',
    'sucks to be you lol'
  ];
  */
 private insults: string[] = [
  'you died bruh',
  'how did you died?'
 ];

  private textChangeTimer: number = 0;
  private textChangeInterval: number = 60;

  private originalX: number = 0;
  private originalY: number = 0;
  private shakeTimer: number = 0;
  private shakeIntensity: number = 8;

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

    this.hsv = Phaser.Display.Color.HSVColorWheel();

    this.gameOverText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 40,
      this.getRandomInsult(),
      {
        fontFamily: 'Arial Black',
        fontSize: 76,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 12,
        align: 'center'
      }
    );
    this.gameOverText.setOrigin(0.5).setDepth(100);

    this.originalX = this.gameOverText.x;
    this.originalY = this.gameOverText.y;

    const survivedSeconds = Math.max(0, Math.floor(data.survivedTime ?? 0));
    const minutes = Math.floor(survivedSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (survivedSeconds % 60).toString().padStart(2, '0');

    this.survivedTimeText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 40,
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

  update(_time: number, delta: number) {
    this.i = (this.i + 1) % 360;
    const topColor = this.hsv[this.i].color;
    const bottomIndex = (this.i + 180) % 360;
    const bottomColor = this.hsv[bottomIndex].color;

    this.gameOverText.setTint(topColor);
    this.gameOverText.setStroke(bottomColor.toString(), 12);

    this.textChangeTimer += delta / (1000 / 60);
    if (this.textChangeTimer >= this.textChangeInterval) {
      this.gameOverText.setText(this.getRandomInsult());
      this.textChangeTimer = 0;
    }

    this.shakeTimer += delta;
    if (this.shakeTimer > 20) {
      const offsetX = Phaser.Math.Between(
        -this.shakeIntensity,
        this.shakeIntensity
      );
      const offsetY = Phaser.Math.Between(
        -this.shakeIntensity,
        this.shakeIntensity
      );
      this.gameOverText.setPosition(
        this.originalX + offsetX,
        this.originalY + offsetY
      );
      this.shakeTimer = 0;
    }
  }

  private getRandomInsult(): string {
    const randomIndex = Math.floor(Math.random() * this.insults.length);
    return this.insults[randomIndex];
  }

  changeScene() {
    this.scene.start('MainMenu');
  }
}
