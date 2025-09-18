import { GameObjects, Scene } from 'phaser';
import { Weapon } from '../../weapons';
import { Item } from '../../items';
import { Player } from '../../entities/living';
import { TextButton } from './TextButton';
import { toNumber } from '../../utils/color';
import { GAME_CONFIG } from '../../constants';
import { WeaponConstructor, ItemConstructor } from '../../types/constructors';

interface Choice {
  kind: 'weapon' | 'item' | 'bonus';
  ctor: WeaponConstructor | ItemConstructor | null;
  name: string;
  button: TextButton;
}

export class SelectionPanel extends GameObjects.Container {
  player: Player;
  onSelectWeapon: (weapon: Weapon) => void;
  onSelectItem: (item: Item) => void;
  choices: Choice[] = [];
  bg: GameObjects.Rectangle;

  constructor(
    scene: Scene,
    player: Player,
    weaponClasses: WeaponConstructor[],
    itemClasses: ItemConstructor[],
    onSelectWeapon: (weapon: Weapon) => void,
    onSelectItem: (item: Item) => void
  ) {
    super(scene);
    this.player = player;
    this.onSelectWeapon = onSelectWeapon;
    this.onSelectItem = onSelectItem;

    const { PANEL_WIDTH, PANEL_HEIGHT, CARD_WIDTH, CARD_HEIGHT, CARD_SPACING } =
      GAME_CONFIG.SELECTION_PANEL;
    const { BACKGROUND_OVERLAY, PANEL_BACKGROUND, PANEL_BORDER } =
      GAME_CONFIG.COLORS;
    const { BACKGROUND_OVERLAY: BG_ALPHA, PANEL: PANEL_ALPHA } =
      GAME_CONFIG.ALPHA;

    this.bg = scene.add
      .rectangle(
        scene.scale.width / 2,
        scene.scale.height / 2,
        scene.scale.width,
        scene.scale.height,
        BACKGROUND_OVERLAY,
        BG_ALPHA
      )
      .setDepth(9999);
    this.add(this.bg);

    const panel = scene.add
      .rectangle(
        scene.scale.width / 2,
        scene.scale.height / 2,
        PANEL_WIDTH,
        PANEL_HEIGHT,
        PANEL_BACKGROUND,
        PANEL_ALPHA
      )
      .setStrokeStyle(3, PANEL_BORDER)
      .setDepth(10000);
    this.add(panel);

    const total = weaponClasses.length + itemClasses.length;
    const cols = Math.min(3, total);
    const rows = Math.ceil(total / cols);

    const cardWidth = CARD_WIDTH;
    const cardHeight = CARD_HEIGHT;
    const spacing = CARD_SPACING;

    const startX =
      scene.scale.width / 2 -
      (cols * cardWidth + (cols - 1) * spacing) / 2 +
      cardWidth / 2;
    const startY =
      scene.scale.height / 2 -
      (rows * cardHeight + (rows - 1) * spacing) / 2 +
      cardHeight / 2;

    let index = 0;

    const makeChoice = (
      ctor: WeaponConstructor | ItemConstructor,
      kind: 'weapon' | 'item',
      instance: Weapon | Item,
      onSelect: () => void
    ) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * (cardWidth + spacing);
      const y = startY + row * (cardHeight + spacing);

      const card = this.createCard(scene, x, y, instance, onSelect);
      this.choices.push({
        kind,
        ctor,
        name: instance.name,
        button: card
      });
      index++;
    };

    weaponClasses.forEach((W) => {
      let instance = this.player.weapons.find((w) => w.name === W.name);
      if (!instance) instance = new W(this.scene, this.player);

      makeChoice(W, 'weapon', instance, () => {
        this.onSelectWeapon(instance);
        this.destroy();
        super.destroy();
      });
    });

    itemClasses.forEach((I) => {
      let instance = this.player.items.find((i) => i.name === I.name);
      if (!instance) instance = new I(this.player);

      makeChoice(I, 'item', instance, () => {
        this.onSelectItem(instance);
        this.destroy();
        super.destroy();
      });
    });

    scene.add.existing(this);

    this.setScale(0.8);
    this.setAlpha(0);
    scene.tweens.add({
      targets: this,
      scale: 1,
      alpha: 1,
      duration: 200,
      ease: 'Back'
    });
  }

  private createCard(
    scene: Scene,
    x: number,
    y: number,
    item: Weapon | Item,
    onClick: () => void
  ) {
    const cardWidth = GAME_CONFIG.SELECTION_PANEL.CARD_WIDTH;
    const cardHeight = GAME_CONFIG.SELECTION_PANEL.CARD_HEIGHT;

    const cardBg = scene.add
      .rectangle(x, y, cardWidth, cardHeight, toNumber('#2b2b2b'), 1)
      .setStrokeStyle(2, toNumber('#ffffff'))
      .setDepth(10001)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', onClick);

    cardBg.on('pointerover', () => {
      scene.tweens.add({ targets: cardBg, scale: 1.05, duration: 100 });
    });
    cardBg.on('pointerout', () => {
      scene.tweens.add({ targets: cardBg, scale: 1, duration: 100 });
    });

    const icon = scene.add
      .circle(x - cardWidth / 2 + 20, y, 20, toNumber('#999999'))
      .setDepth(10002);

    const nameText = scene.add
      .text(x - cardWidth / 2 + 50, y - 15, item.name, {
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#ffffff'
      })
      .setOrigin(0, 0);

    const levelText = scene.add
      .text(x - cardWidth / 2 + 50, y, `Lv. ${item.level}`, {
        fontSize: '12px',
        color: '#aaaaaa'
      })
      .setOrigin(0, 0);

    const container = scene.add
      .container(0, 0, [cardBg, icon, nameText, levelText])
      .setSize(cardWidth, cardHeight);

    if ('description' in item && item.description) {
      const descText = scene.add
        .text(x - cardWidth / 2 + 50, y + 15, item.description, {
          fontSize: '12px',
          color: '#cccccc',
          wordWrap: { width: cardWidth - 60 }
        })
        .setOrigin(0, 0);
      container.add(descText);
    }

    this.add(container);
    return container as unknown as TextButton;
  }

  destroy(fromScene?: boolean) {
    this.bg?.destroy();
    this.choices.forEach((c) => c.button.destroy());
    this.choices = [];
    super.destroy(fromScene);
  }
}
