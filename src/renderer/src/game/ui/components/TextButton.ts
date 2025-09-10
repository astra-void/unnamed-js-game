type TextButtonOptions = {
  textColor?: string;
  hoverColor?: string;
  onClick?: () => void;
};

export class TextButton extends Phaser.GameObjects.Text {
  private defaultColor: string;
  private hoverColor: string;
  private clickCallback?: () => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle = {},
    options: TextButtonOptions = {}
  ) {
    super(scene, x, y, text, style);

    this.defaultColor = options.textColor ?? 'rgb(255, 255, 255)';
    this.hoverColor = options.hoverColor ?? 'rgb(230, 230, 230)';
    this.clickCallback = options.onClick;

    this.setColor(this.defaultColor);
    this.setInteractive({ useHandCursor: true });
    scene.add.existing(this);

    this.on('pointerdown', () => this.clickCallback?.());
    this.on('pointerover', () => this.setColor(this.hoverColor));
    this.on('pointerout', () => this.setColor(this.defaultColor));
  }

  updateTextContent(text: string) {
    this.setText(text);
  }
}
