import { toHex } from '../../utils/color';
import { UIConfig } from '../UIConfig';

type TextButtonOptions = {
  textColor?: string;
  hoverColor?: string;
  backgroundColor?: number;
  hoverBackgroundColor?: number;
  onClick?: () => void;
  minWidth?: number;
  maxWidth?: number;
  padding?: { x: number; y: number };
  responsive?: boolean;
};

export class TextButton extends Phaser.GameObjects.Container {
  private label: Phaser.GameObjects.Text;
  private bg: Phaser.GameObjects.Rectangle;
  private clickCallback?: () => void;
  private options: TextButtonOptions;
  private baseStyle: Phaser.Types.GameObjects.Text.TextStyle;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle = {},
    options: TextButtonOptions = {}
  ) {
    super(scene, x, y);

    this.options = {
      responsive: true,
      minWidth: 120,
      maxWidth: 400,
      padding: { x: 24, y: 12 },
      ...options
    };

    const defaultTextColor = options.textColor ?? toHex('rgb(255, 255, 255)');
    const hoverTextColor = options.hoverColor ?? toHex('rgb(200, 200, 200)');
    const defaultBg = options.backgroundColor ?? 0x333333;
    const hoverBg = options.hoverBackgroundColor ?? 0x555555;
    this.clickCallback = options.onClick;

    const scale = this.options.responsive
      ? UIConfig.getScale(scene.scale.width, scene.scale.height)
      : null;

    const fontSize = scale?.fontSize.md ?? 20;

    this.baseStyle = {
      fontSize: `${fontSize}px`,
      fontStyle: 'bold',
      fontFamily: 'sans-serif',
      color: defaultTextColor,
      ...style
    };

    this.label = scene.add.text(0, 0, text, this.baseStyle);
    this.label.setOrigin(0.5);

    this.updateButtonSize();

    this.bg.setFillStyle(defaultBg, 0.85);
    this.bg.setStrokeStyle(2, 0xffffff, 0.3);

    this.add([this.bg, this.label]);

    this.setSize(this.bg.width, this.bg.height);
    this.setInteractive();
    if (this.input) this.input.cursor = 'pointer';

    this.on('pointerdown', () => {
      this.scene.tweens.add({
        targets: this,
        scale: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          this.clickCallback?.();
        }
      });
    });

    this.on('pointerover', () => {
      this.bg.setFillStyle(hoverBg, 0.95);
      this.label.setColor(hoverTextColor);
      this.scene.tweens.add({
        targets: this,
        scale: 1.05,
        duration: 100,
        ease: 'Quad.easeOut'
      });
    });

    this.on('pointerout', () => {
      this.bg.setFillStyle(defaultBg, 0.85);
      this.label.setColor(defaultTextColor);
      this.scene.tweens.add({
        targets: this,
        scale: 1,
        duration: 100,
        ease: 'Quad.easeOut'
      });
    });

    scene.add.existing(this);
  }

  private updateButtonSize(): void {
    const padding = this.options.padding!;
    const textWidth = this.label.width;
    const textHeight = this.label.height;

    let buttonWidth = textWidth + padding.x * 2;
    let buttonHeight = textHeight + padding.y * 2;

    if (this.options.minWidth) {
      buttonWidth = Math.max(buttonWidth, this.options.minWidth);
    }
    if (this.options.maxWidth) {
      buttonWidth = Math.min(buttonWidth, this.options.maxWidth);

      if (textWidth > this.options.maxWidth - padding.x * 2) {
        const maxTextWidth = this.options.maxWidth - padding.x * 2;
        const currentFontSize = parseInt(this.baseStyle.fontSize as string);
        const newFontSize = UIConfig.getAdaptiveFontSize(
          this.label.text,
          maxTextWidth,
          currentFontSize,
          12
        );

        this.label.setFontSize(newFontSize);
        buttonWidth = this.options.maxWidth;
      }
    }

    if (!this.bg) {
      this.bg = this.scene.add.rectangle(0, 0, buttonWidth, buttonHeight);
      this.bg.setOrigin(0.5);
    } else {
      this.bg.setSize(buttonWidth, buttonHeight);
    }
  }

  updateTextContent(text: string): void {
    this.label.setText(text);
    this.updateButtonSize();
    this.removeInteractive();

    this.setInteractive();
    if (this.input) this.input.cursor = 'pointer';
  }

  setEnabled(enabled: boolean): void {
    this.setInteractive(enabled);
    this.setAlpha(enabled ? 1 : 0.5);
  }

  onResize(width: number, height: number): void {
    if (!this.options.responsive) return;

    const scale = UIConfig.getScale(width, height);
    const newFontSize = scale.fontSize.md;

    this.label.setFontSize(newFontSize);
    this.updateButtonSize();

    this.removeInteractive();
    this.setInteractive();
    if (this.input) {
      this.input.cursor = 'pointer';
    }
  }
}
