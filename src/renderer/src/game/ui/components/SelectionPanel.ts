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
  private panelPadding: number;
  private cardWidth: number;
  private cardHeight: number;
  private cardSpacing: number;
  private options: Required<SelectionPanelOptions>;

  constructor(
    scene: Phaser.Scene,
    choices: CardContent[],
    options: SelectionPanelOptions = {}
  ) {
    super(scene, 0, 0);

    this.options = {
      title: options.title ?? '',
      maxChoices: options.maxChoices ?? 3,
      backgroundColor: options.backgroundColor ?? 0x1a1a1a,
      onSelect: options.onSelect ?? (() => {}),
      onClose: options.onClose ?? (() => {})
    };

    const uiScale = UIConfig.getScale(scene.scale.width, scene.scale.height);
    this.panelPadding = uiScale.spacing.xl;
    this.cardWidth = Math.min(
      Math.max(uiScale.cardWidth, 320),
      scene.scale.width * 0.75
    );
    this.cardHeight = Math.min(
      Math.max(uiScale.cardHeight, 240),
      scene.scale.height * 0.35
    );
    this.cardSpacing = uiScale.spacing.lg;

    const cardCount = Math.min(choices.length, this.options.maxChoices);
    const estimatedTitleHeight = this.options.title
      ? uiScale.fontSize.xl * 2
      : this.panelPadding;
    const estimatedContentHeight =
      cardCount * this.cardHeight + (cardCount - 1) * this.cardSpacing;

    this.panelWidth = Phaser.Math.Clamp(
      Math.max(uiScale.panelWidth, this.cardWidth + this.panelPadding * 2),
      uiScale.panelWidth,
      scene.scale.width * 0.9
    );
    this.panelHeight = Phaser.Math.Clamp(
      Math.max(
        uiScale.panelHeight,
        estimatedContentHeight + estimatedTitleHeight + this.panelPadding
      ),
      uiScale.panelHeight,
      scene.scale.height * 0.9
    );

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
        -this.panelHeight / 2 + this.panelPadding,
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

    this.createCards(choices);
    this.resizePanelForContent(uiScale);

    this.animateIn();

    scene.add.existing(this);
  }

  private createCards(choices: CardContent[]): void {
    const cardWidth = this.cardWidth;
    const cardHeight = this.cardHeight;

    choices.slice(0, this.options.maxChoices).forEach((choice, index) => {
      const card = new InfoCard(this.scene, 0, 0, choice, {
        width: cardWidth,
        height: cardHeight,
        responsive: true
      });

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

  private repositionCards(): void {
    const cardHeight = this.cardHeight;
    const spacing = this.cardSpacing;

    const titleHeight = this.titleText
      ? this.titleText.height + this.panelPadding * 1.5
      : this.panelPadding;
    const availableHeight = this.panelHeight - titleHeight - this.panelPadding;
    const cardCount = this.cards.length;
    const totalHeight = cardCount * cardHeight + (cardCount - 1) * spacing;
    const centeredOffset = Math.max(0, (availableHeight - totalHeight) / 2);
    const startY =
      -this.panelHeight / 2 + titleHeight + centeredOffset + cardHeight / 2;

    this.cards.forEach((card, index) => {
      card.setPosition(0, startY + index * (cardHeight + spacing));
    });
  }

  private resizePanelForContent(uiScale: UIScale): void {
    const cardCount = this.cards.length || this.options.maxChoices;
    const totalCardHeight =
      cardCount * this.cardHeight +
      Math.max(0, cardCount - 1) * this.cardSpacing;
    const titleHeight = this.titleText
      ? this.titleText.height + this.panelPadding
      : this.panelPadding;

    const targetWidth = Math.max(
      uiScale.panelWidth,
      this.cardWidth + this.panelPadding * 2
    );
    const targetHeight = Math.max(
      uiScale.panelHeight,
      totalCardHeight + titleHeight + this.panelPadding
    );

    this.panelWidth = Phaser.Math.Clamp(
      targetWidth,
      uiScale.panelWidth,
      this.scene.scale.width * 0.9
    );
    this.panelHeight = Phaser.Math.Clamp(
      targetHeight,
      uiScale.panelHeight,
      this.scene.scale.height * 0.9
    );

    this.panelBg.setSize(this.panelWidth, this.panelHeight);

    if (this.titleText) {
      this.titleText.setY(-this.panelHeight / 2 + this.panelPadding);
    }

    this.repositionCards();
  }

  onResize(width: number, height: number): void {
    const uiScale = UIConfig.getScale(width, height);

    this.overlay.setSize(width, height);
    this.panelPadding = uiScale.spacing.xl;
    this.cardWidth = Math.min(Math.max(uiScale.cardWidth, 320), width * 0.75);
    this.cardHeight = Math.min(
      Math.max(uiScale.cardHeight, 240),
      height * 0.35
    );
    this.cardSpacing = uiScale.spacing.lg;

    this.panelWidth = Math.max(
      uiScale.panelWidth,
      this.cardWidth + this.panelPadding * 2
    );
    this.panelHeight = Math.max(
      uiScale.panelHeight,
      this.cardHeight * this.cards.length +
        this.cardSpacing * Math.max(0, this.cards.length - 1) +
        (this.titleText
          ? this.titleText.height + this.panelPadding * 2
          : this.panelPadding * 2)
    );
    this.panelWidth = Math.min(this.panelWidth, width * 0.9);
    this.panelHeight = Math.min(this.panelHeight, height * 0.9);
    this.panelBg.setSize(this.panelWidth, this.panelHeight);
    this.setPosition(width / 2, height / 2);

    if (this.titleText) {
      this.titleText.setFontSize(`${uiScale.fontSize.xl}px`);
      this.titleText.setY(-this.panelHeight / 2 + this.panelPadding);
    }

    this.cards.forEach((card) => card.onResize(width, height));

    this.resizePanelForContent(uiScale);
  }
}
