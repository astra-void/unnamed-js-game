import { UIConfig, UIScale } from '../UIConfig';

export interface CardContent {
  title: string;
  description: string;
  level?: number;
  icon?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface CardStyle {
  width?: number;
  height?: number;
  backgroundColor?: number;
  borderColor?: number;
  titleColor?: string;
  descriptionColor?: string;
  responsive?: boolean;
}

export class InfoCard extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle;
  private titleText: Phaser.GameObjects.Text;
  private descriptionText: Phaser.GameObjects.Text;
  private levelBadge?: Phaser.GameObjects.Container;
  private iconSprite?: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image;

  private cardWidth: number;
  private cardHeight: number;
  private padding: number;
  private style: Required<CardStyle>;

  private visualElements: Phaser.GameObjects.GameObject[];

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    content: CardContent,
    style: CardStyle = {}
  ) {
    super(scene, x, y);

    this.visualElements = [];

    const uiScale =
      style.responsive !== false
        ? UIConfig.getScale(scene.scale.width, scene.scale.height)
        : null;

    this.style = {
      width: style.width ?? uiScale?.cardWidth ?? 220,
      height: style.height ?? uiScale?.cardHeight ?? 160,
      backgroundColor: style.backgroundColor ?? 0x2b2b2b,
      borderColor: style.borderColor ?? this.getRarityColor(content.rarity),
      titleColor: style.titleColor ?? '#ffffff',
      descriptionColor: style.descriptionColor ?? '#cccccc',
      responsive: style.responsive ?? true
    };

    this.cardWidth = this.style.width;
    this.cardHeight = this.style.height;
    this.padding = uiScale?.spacing.md ?? 16;

    this.bg = scene.add.rectangle(0, 0, this.cardWidth, this.cardHeight);
    this.bg.setFillStyle(this.style.backgroundColor, 0.9);
    this.bg.setStrokeStyle(3, this.style.borderColor, 0.8);
    this.bg.setOrigin(0.5);
    this.add(this.bg);
    this.visualElements.push(this.bg);

    this.updateLayout(content, uiScale);

    this.setSize(this.cardWidth, this.cardHeight);
    scene.add.existing(this);
  }

  private updateLayout(
    content: Partial<CardContent>,
    uiScale: UIScale | null
  ): void {
    const contentWidth = this.cardWidth - this.padding * 2;
    const contentHeight = this.cardHeight - this.padding * 2;

    let currentY = -this.cardHeight / 2 + this.padding;

    if (content.icon) {
      if (!this.iconSprite) {
        if (this.scene.textures.exists(content.icon)) {
          this.iconSprite = this.scene.add.sprite(
            0,
            currentY + 20,
            content.icon
          );
          this.iconSprite.setOrigin(0.5, 0);
          this.iconSprite.setDisplaySize(40, 40);
          this.add(this.iconSprite);
          this.visualElements.push(this.iconSprite);
        } else {
          console.warn(`Icon texture not found: ${content.icon}`);
        }
      } else {
        if (this.scene.textures.exists(content.icon)) {
          this.iconSprite.setTexture(content.icon);
        }
      }
    }
    if (this.iconSprite) {
      this.iconSprite.setPosition(0, currentY + 20);
      currentY += 50;
    }

    const titleFontSize = uiScale?.fontSize.lg ?? 20;
    const titleText = content.title ?? this.titleText?.text ?? '';
    const titleStyle = UIConfig.getMultilineTextStyle(
      titleText,
      contentWidth,
      titleFontSize * 2,
      titleFontSize
    );

    if (!this.titleText) {
      this.titleText = this.scene.add.text(0, currentY, titleText, {
        fontSize: `${titleStyle.fontSize}px`,
        fontFamily: 'sans-serif',
        fontStyle: 'bold',
        color: this.style.titleColor,
        align: 'center',
        wordWrap: { width: contentWidth }
      });
      this.titleText.setOrigin(0.5, 0);
      this.add(this.titleText);
      this.visualElements.push(this.titleText);
    } else {
      this.titleText.setText(titleText);
      this.titleText.setFontSize(titleStyle.fontSize);
      this.titleText.setWordWrapWidth(contentWidth);
      this.titleText.setPosition(0, currentY);
    }
    currentY += this.titleText.height + (uiScale?.spacing.sm ?? 8);

    const level = content.level;
    if (level !== undefined && !this.levelBadge) {
      this.levelBadge = this.createLevelBadge(level, uiScale!);
      this.add(this.levelBadge);
      this.visualElements.push(this.levelBadge);
    }
    if (this.levelBadge) {
      if (level !== undefined) {
        (this.levelBadge.getAt(1) as Phaser.GameObjects.Text).setText(
          `Lv.${level}`
        );
      }
      (this.levelBadge.getAt(1) as Phaser.GameObjects.Text).setFontSize(
        uiScale?.fontSize.sm ?? 14
      );
      this.levelBadge.setPosition(0, currentY);
      currentY += 24 + (uiScale?.spacing.xs ?? 6);
    }

    const descFontSize = uiScale?.fontSize.sm ?? 14;
    const descText = content.description ?? this.descriptionText?.text ?? '';
    const descStyle = UIConfig.getMultilineTextStyle(
      descText,
      contentWidth,
      contentHeight - (currentY + this.cardHeight / 2 - this.padding),
      descFontSize
    );

    if (!this.descriptionText) {
      this.descriptionText = this.scene.add.text(0, currentY, descText, {
        fontSize: `${descStyle.fontSize}px`,
        fontFamily: 'sans-serif',
        color: this.style.descriptionColor,
        align: 'center',
        wordWrap: { width: contentWidth }
      });
      this.descriptionText.setOrigin(0.5, 0);
      this.add(this.descriptionText);
      this.visualElements.push(this.descriptionText);
    } else {
      this.descriptionText.setText(descText);
      this.descriptionText.setFontSize(descStyle.fontSize);
      this.descriptionText.setWordWrapWidth(contentWidth);
      this.descriptionText.setPosition(0, currentY);
    }
  }

  private createLevelBadge(
    level: number,
    uiScale: UIScale
  ): Phaser.GameObjects.Container {
    const badgeContainer = this.scene.add.container(0, 0);
    const badgeWidth = 60;
    const badgeHeight = 24;

    const badgeBg = this.scene.add.rectangle(
      0,
      0,
      badgeWidth,
      badgeHeight,
      0xffaa00,
      0.3
    );
    badgeBg.setStrokeStyle(2, 0xffaa00, 0.8);

    const levelText = this.scene.add.text(0, 0, `Lv.${level}`, {
      fontSize: `${uiScale?.fontSize.sm ?? 14}px`,
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      color: '#ffaa00'
    });
    levelText.setOrigin(0.5);

    badgeContainer.add([badgeBg, levelText]);
    return badgeContainer;
  }

  private getRarityColor(rarity?: string): number {
    switch (rarity) {
      case 'common':
        return 0x808080;
      case 'rare':
        return 0x4169e1;
      case 'epic':
        return 0x9932cc;
      case 'legendary':
        return 0xffa500;
      default:
        return 0xffffff;
    }
  }

  enableHover(
    onHover?: () => void,
    onOut?: () => void,
    onClick?: () => void
  ): void {
    this.setInteractive({ useHandCursor: true });

    const children = this.visualElements;

    this.on('pointerover', () => {
      this.scene.tweens.add({
        targets: children,
        scale: 1.05,
        duration: 150,
        ease: 'Back.easeOut'
      });
      this.bg.setStrokeStyle(3, this.style.borderColor, 1);
      onHover?.();
    });

    this.on('pointerout', () => {
      this.scene.tweens.add({
        targets: children,
        scale: 1,
        duration: 150,
        ease: 'Back.easeIn'
      });
      this.bg.setStrokeStyle(3, this.style.borderColor, 0.8);
      onOut?.();
    });

    if (onClick) {
      this.on('pointerdown', () => {
        this.scene.tweens.add({
          targets: children,
          scale: 0.95,
          duration: 50,
          yoyo: true,
          onComplete: () => onClick()
        });
      });
    }
  }

  updateContent(content: Partial<CardContent>): void {
    const uiScale = this.style.responsive
      ? UIConfig.getScale(this.scene.scale.width, this.scene.scale.height)
      : null;
    this.updateLayout(content, uiScale);
  }

  onResize(width: number, height: number): void {
    if (!this.style.responsive) return;

    const uiScale = UIConfig.getScale(width, height);

    this.cardWidth = uiScale.cardWidth ?? this.style.width;
    this.cardHeight = uiScale.cardHeight ?? this.style.height;
    this.padding = uiScale.spacing.md;

    this.bg.setSize(this.cardWidth, this.cardHeight);
    this.setSize(this.cardWidth, this.cardHeight);

    this.updateLayout({}, uiScale);

    if (this.input) {
      this.removeInteractive();
      this.setInteractive({
        hitArea: new Phaser.Geom.Rectangle(
          -this.cardWidth / 2,
          -this.cardHeight / 2,
          this.cardWidth,
          this.cardHeight
        ),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        useHandCursor: true
      });
    }
  }
}
