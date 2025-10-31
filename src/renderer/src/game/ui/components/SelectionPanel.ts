import { UIConfig, UIScale } from '../UIConfig';
import { CardContent, InfoCard } from './InfoCard';

export interface SelectionPanelOptions {
  title?: string;
  maxChoices?: number;
  backgroundColor?: number;
  onSelect?: (index: number) => void;
  onClose?: () => void;
}

export class SelectionPanel extends Phaser.GameObjects.Container {
  private overlay: Phaser.GameObjects.Rectangle;
  private panelBg: Phaser.GameObjects.Rectangle;
  private titleText?: Phaser.GameObjects.Text;
  private cards: InfoCard[] = [];

  private panelWidth: number;
  private panelHeight: number;
  private options: Required<SelectionPanelOptions>;

  constructor(
    scene: Phaser.Scene,
    choices: CardContent[],
    options: SelectionPanelOptions = {}
  ) {
    super(scene, 0, 0);

    this.options = {
      title: options.title ?? '선택하세요',
      maxChoices: options.maxChoices ?? 3,
      backgroundColor: options.backgroundColor ?? 0x1a1a1a,
      onSelect: options.onSelect ?? (() => {}),
      onClose: options.onClose ?? (() => {})
    };

    const uiScale = UIConfig.getScale(scene.scale.width, scene.scale.height);
    this.panelWidth = uiScale.panelWidth;
    this.panelHeight = uiScale.panelHeight;

    this.setPosition(scene.scale.width / 2, scene.scale.height / 2);
    this.setDepth(1000);

    this.overlay = scene.add.rectangle(
      0,
      0,
      scene.scale.width,
      scene.scale.height,
      0x000000,
      0.7
    );
    this.overlay.setOrigin(0.5);
    this.overlay.setPosition(0, 0);
    this.add(this.overlay);

    this.panelBg = scene.add.rectangle(0, 0, this.panelWidth, this.panelHeight);
    this.panelBg.setFillStyle(this.options.backgroundColor, 0.95);
    this.panelBg.setStrokeStyle(3, 0xffffff, 0.3);
    this.panelBg.setOrigin(0.5);
    this.add(this.panelBg);

    if (this.options.title) {
      this.titleText = scene.add.text(
        0,
        -this.panelHeight / 2 + 30,
        this.options.title,
        {
          fontSize: `${uiScale.fontSize.xl}px`,
          fontFamily: 'sans-serif',
          fontStyle: 'bold',
          color: '#ffffff'
        }
      );
      this.titleText.setOrigin(0.5);
      this.add(this.titleText);
    }

    this.createCards(choices, uiScale);

    this.animateIn();

    scene.add.existing(this);
  }

  private createCards(choices: CardContent[], uiScale: UIScale): void {
    const cardWidth = uiScale.cardWidth;
    const cardHeight = uiScale.cardHeight;
    const spacing = uiScale.spacing.lg;

    const titleHeight = this.titleText ? this.titleText.height + 40 : 40;
    const availableHeight = this.panelHeight - titleHeight - 40;
    const availableWidth = this.panelWidth - 40;

    const positions = UIConfig.calculateCardGrid(
      availableWidth,
      availableHeight,
      cardWidth,
      cardHeight,
      spacing,
      Math.min(choices.length, this.options.maxChoices)
    );

    const yOffset = titleHeight / 2;

    choices.slice(0, this.options.maxChoices).forEach((choice, index) => {
      const pos = positions[index];

      const card = new InfoCard(
        this.scene,
        pos.x - availableWidth / 2,
        pos.y - availableHeight / 2 + yOffset,
        choice,
        {
          width: cardWidth,
          height: cardHeight,
          responsive: true
        }
      );

      card.enableHover(undefined, undefined, () =>
        this.handleCardSelect(index)
      );

      this.cards.push(card);
      this.add(card);

      card.setAlpha(0);
      card.setScale(0.8);
      this.scene.tweens.add({
        targets: card,
        alpha: 1,
        scale: 1,
        duration: 300,
        delay: 100 + index * 100,
        ease: 'Back.easeOut'
      });
    });
  }

  private handleCardSelect(index: number): void {
    // this.cards[index].setTint(0x00ff00); DEBUG PLACEHOLDER

    this.scene.time.delayedCall(150, () => {
      this.options.onSelect(index);
      this.close();
    });
  }

  private animateIn(): void {
    this.overlay.setAlpha(0);
    this.panelBg.setScale(0.8);
    this.panelBg.setAlpha(0);

    if (this.titleText) {
      this.titleText.setAlpha(0);
      this.titleText.setY(this.titleText.y - 20);
    }

    this.scene.tweens.add({
      targets: this.overlay,
      alpha: 0.7,
      duration: 200
    });

    this.scene.tweens.add({
      targets: this.panelBg,
      scale: 1,
      alpha: 1,
      duration: 300,
      ease: 'Back.easeOut'
    });

    if (this.titleText) {
      this.scene.tweens.add({
        targets: this.titleText,
        alpha: 1,
        y: this.titleText.y + 20,
        duration: 300,
        delay: 100,
        ease: 'Quad.easeOut'
      });
    }
  }

  close(): void {
    this.cards.forEach((card, index) => {
      this.scene.tweens.add({
        targets: card,
        alpha: 0,
        scale: 0.8,
        duration: 200,
        delay: index * 50,
        ease: 'Back.easeIn'
      });
    });

    if (this.titleText) {
      this.scene.tweens.add({
        targets: this.titleText,
        alpha: 0,
        y: this.titleText.y - 20,
        duration: 200
      });
    }

    this.scene.tweens.add({
      targets: this.panelBg,
      scale: 0.8,
      alpha: 0,
      duration: 200,
      delay: 100
    });

    this.scene.tweens.add({
      targets: this.overlay,
      alpha: 0,
      duration: 200,
      delay: 100,
      onComplete: () => {
        this.options.onClose();
        this.destroy();
      }
    });
  }

  private repositionCards(uiScale: UIScale): void {
    const cardWidth = uiScale.cardWidth;
    const cardHeight = uiScale.cardHeight;
    const spacing = uiScale.spacing.lg;

    const titleHeight = this.titleText ? this.titleText.height + 40 : 40;
    const availableHeight = this.panelHeight - titleHeight - 40;
    const availableWidth = this.panelWidth - 40;

    const positions = UIConfig.calculateCardGrid(
      availableWidth,
      availableHeight,
      cardWidth,
      cardHeight,
      spacing,
      this.cards.length
    );

    const yOffset = titleHeight / 2;

    this.cards.forEach((card, index) => {
      const pos = positions[index];

      card.setPosition(
        pos.x - availableWidth / 2,
        pos.y - availableHeight / 2 + yOffset
      );
    });
  }

  onResize(width: number, height: number): void {
    const uiScale = UIConfig.getScale(width, height);

    this.overlay.setSize(width, height);
    this.panelWidth = uiScale.panelWidth;
    this.panelHeight = uiScale.panelHeight;
    this.panelBg.setSize(this.panelWidth, this.panelHeight);
    this.setPosition(width / 2, height / 2);

    if (this.titleText) {
      this.titleText.setFontSize(`${uiScale.fontSize.xl}px`);
      this.titleText.setY(-this.panelHeight / 2 + 30);
    }

    this.cards.forEach((card) => card.onResize(width, height));

    this.repositionCards(uiScale);
  }
}
