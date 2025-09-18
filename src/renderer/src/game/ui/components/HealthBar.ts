import { GAME_CONFIG } from '../../constants';

export class HealthBar extends Phaser.GameObjects.Container {
  private bar: Phaser.GameObjects.Graphics;
  private background: Phaser.GameObjects.Graphics;
  private maxHp: number;
  private value: number;
  width: number;
  height: number;

  constructor(scene: Phaser.Scene, x: number, y: number, maxHp: number) {
    super(scene, x, y);

    this.maxHp = maxHp;
    this.value = maxHp;
    this.width = 50;
    this.height = 6;

    this.background = scene.add.graphics();
    this.bar = scene.add.graphics();

    this.add(this.background);
    this.add(this.bar);

    this.draw();

    scene.add.existing(this);
  }

  private draw() {
    this.background.clear();
    this.bar.clear();

    this.background.fillStyle(0x555555, 0.6);
    this.background.fillRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    const hpPercent = Phaser.Math.Clamp(this.value / this.maxHp, 0, 1);
    const color = Phaser.Display.Color.Interpolate.ColorWithColor(
      new Phaser.Display.Color(255, 0, 0),
      new Phaser.Display.Color(0, 255, 0),
      100,
      hpPercent * 100
    );
    const tint = Phaser.Display.Color.GetColor(color.r, color.g, color.b);

    this.bar.fillStyle(tint, 1);
    this.bar.fillRect(
      -this.width / 2,
      -this.height / 2,
      this.width * hpPercent,
      this.height
    );
  }

  setHealth(value: number) {
    this.value = value;
    this.draw();
  }

  setPositionTo(target: Phaser.GameObjects.Sprite) {
    this.x = target.x;
    this.y =
      target.y - target.displayHeight / 2 + GAME_CONFIG.OFFSETS.HEALTH_BAR_Y;
  }
}
