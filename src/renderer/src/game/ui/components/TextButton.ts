import { toHex } from '../../utils/color';

type TextButtonOptions = {
  textColor?: string;
  hoverColor?: string;
  backgroundColor?: number;
  hoverBackgroundColor?: number;
  onClick?: () => void;
};

export class TextButton extends Phaser.GameObjects.Container {
  private label: Phaser.GameObjects.Text;
  private bg: Phaser.GameObjects.Rectangle;
  private clickCallback?: () => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle = {},
    options: TextButtonOptions = {}
  ) {
    super(scene, x, y);

    const defaultTextColor = options.textColor ?? toHex('rgb(255, 255, 255)');
    const hoverTextColor = options.hoverColor ?? toHex('rgb(200, 200, 200)');
    const defaultBg = options.backgroundColor ?? 0x333333;
    const hoverBg = options.hoverBackgroundColor ?? 0x555555;
    this.clickCallback = options.onClick;

    this.label = scene.add.text(0, 0, text, {
      fontSize: '20px',
      fontStyle: 'bold',
      fontFamily: 'sans-serif',
      color: defaultTextColor,
      ...style
    });
    this.label.setOrigin(0.5);

    this.bg = scene.add.rectangle(
      0,
      0,
      this.label.width + 40,
      this.label.height + 20,
      defaultBg,
      0.8
    );
    this.bg.setOrigin(0.5);
    this.bg.setStrokeStyle(2, 0xffffff, 0.5);

    this.add([this.bg, this.label]);

    this.setSize(this.bg.width, this.bg.height);
    this.setInteractive({ useHandCursor: true });

    this.on('pointerdown', () => {
      this.clickCallback?.();
    });
    this.on('pointerover', () => {
      this.bg.setFillStyle(hoverBg, 0.9);
      this.label.setColor(hoverTextColor);
      this.setScale(1.05);
    });
    this.on('pointerout', () => {
      this.bg.setFillStyle(defaultBg, 0.8);
      this.label.setColor(defaultTextColor);
      this.setScale(1);
    });

    scene.add.existing(this);
  }

  updateTextContent(text: string) {
    this.label.setText(text);
    this.bg.width = this.label.width + 40;
    this.bg.height = this.label.height + 20;
  }
}
