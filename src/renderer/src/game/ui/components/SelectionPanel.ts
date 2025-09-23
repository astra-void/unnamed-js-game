import { GameObjects, Scene } from 'phaser';
import { Weapon } from '../../weapons';
import { Item } from '../../items';
import { Player } from '../../entities/living';
import { TextButton } from './TextButton';
import { toNumber } from '../../utils/color';
import { GAME_CONFIG } from '../../constants';
import { WeaponConstructor, ItemConstructor } from '../../types/constructors';
import { FusionRecipe } from '../../fusion';
import { UIComponent } from '../../types/ui';
import { EventBus } from '../../EventBus';

interface Choice {
  kind: 'weapon' | 'item' | 'fusion';
  ctor: WeaponConstructor | ItemConstructor | null;
  recipe?: FusionRecipe;
  name: string;
  button: TextButton;
}

export class SelectionPanel
  extends GameObjects.Container
  implements UIComponent
{
  id = 'selectionPanel';
  object: GameObjects.Container;
  player: Player;
  choices: Choice[] = [];
  bg: GameObjects.Rectangle;

  selectedCount = 0;
  maxSelect = 3;

  constructor(
    scene: Scene,
    player: Player,
    weaponClasses: WeaponConstructor[],
    itemClasses: ItemConstructor[],
    fusionRecipes: FusionRecipe[]
  ) {
    super(scene);
    this.player = player;
    this.object = this;

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

    const total =
      weaponClasses.length + itemClasses.length + fusionRecipes.length;
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

    const handleSelection = (
      kind: 'weapon' | 'item' | 'fusion',
      payload: Weapon | Item | FusionRecipe
    ) => {
      if (this.selectedCount >= this.maxSelect) return;
      this.selectedCount++;
      EventBus.emit(`selection:${kind}`, payload);

      if (this.selectedCount >= this.maxSelect) {
        this.destroy();
      }
    };

    const makeChoice = (
      ctor: WeaponConstructor | ItemConstructor | null,
      kind: 'weapon' | 'item' | 'fusion',
      instance: Weapon | Item | null,
      recipe: FusionRecipe | null
    ) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * (cardWidth + spacing);
      const y = startY + row * (cardHeight + spacing);

      let card: TextButton;
      let name: string;

      if (kind === 'fusion' && recipe) {
        card = this.createFusionCard(scene, x, y, recipe, handleSelection);
        name = recipe.name;
      } else if (instance) {
        card = this.createCard(
          scene,
          x,
          y,
          instance,
          kind as 'weapon' | 'item',
          handleSelection
        );
        name = instance.name;
      } else {
        return;
      }

      this.choices.push({
        kind,
        ctor,
        recipe: recipe || undefined,
        name,
        button: card
      });
      index++;
    };

    weaponClasses.forEach((W) => {
      let instance = this.player.weaponManager.findWeapon(W.name);
      if (!instance) instance = new W(this.scene, this.player);
      makeChoice(W, 'weapon', instance, null);
    });

    itemClasses.forEach((I) => {
      let instance = this.player.itemManager.findItem(I.name);
      if (!instance) instance = new I(this.player);
      makeChoice(I, 'item', instance, null);
    });

    fusionRecipes.forEach((recipe) => makeChoice(null, 'fusion', null, recipe));

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
    instance: Weapon | Item,
    kind: 'weapon' | 'item',
    onSelect: (
      kind: 'weapon' | 'item' | 'fusion',
      payload: Weapon | Item | FusionRecipe
    ) => void
  ) {
    const cardWidth = GAME_CONFIG.SELECTION_PANEL.CARD_WIDTH;
    const cardHeight = GAME_CONFIG.SELECTION_PANEL.CARD_HEIGHT;

    const cardBg = scene.add
      .rectangle(x, y, cardWidth, cardHeight, toNumber('#2b2b2b'), 1)
      .setStrokeStyle(2, toNumber('#ffffff'))
      .setDepth(10001)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        onSelect(kind, instance);
      });

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
      .text(x - cardWidth / 2 + 50, y - 15, instance.name, {
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#ffffff'
      })
      .setOrigin(0, 0);

    const levelText = scene.add
      .text(
        x - cardWidth / 2 + 50,
        y,
        instance.level === 0 ? 'New Item' : `Lv. ${instance.level}`,
        {
          fontSize: '12px',
          color: '#aaaaaa'
        }
      )
      .setOrigin(0, 0);

    const descText = scene.add
      .text(x - cardWidth / 2 + 50, y + 15, instance.description, {
        fontSize: '12px',
        color: '#cccccc',
        wordWrap: { width: cardWidth - 60 }
      })
      .setOrigin(0, 0);

    const container = scene.add
      .container(0, 0, [cardBg, icon, nameText, levelText, descText])
      .setSize(cardWidth, cardHeight);

    this.add(container);
    return container as unknown as TextButton;
  }

  private createFusionCard(
    scene: Scene,
    x: number,
    y: number,
    recipe: FusionRecipe,
    onSelect: (
      kind: 'weapon' | 'item' | 'fusion',
      payload: Weapon | Item | FusionRecipe
    ) => void
  ) {
    const cardWidth = GAME_CONFIG.SELECTION_PANEL.CARD_WIDTH;
    const cardHeight = GAME_CONFIG.SELECTION_PANEL.CARD_HEIGHT;

    const cardBg = scene.add
      .rectangle(x, y, cardWidth, cardHeight, 0x6a1b9a, 1)
      .setStrokeStyle(3, 0xffd700)
      .setDepth(10001)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        onSelect('fusion', recipe);
      });

    cardBg.on('pointerover', () => {
      scene.tweens.add({
        targets: cardBg,
        scale: 1.05,
        tint: 0xffff99,
        duration: 100
      });
    });
    cardBg.on('pointerout', () => {
      scene.tweens.add({
        targets: cardBg,
        scale: 1,
        tint: 0xffffff,
        duration: 100
      });
    });

    const icon = scene.add
      .text(x - cardWidth / 2 + 20, y - 20, '🔧', { fontSize: '24px' })
      .setOrigin(0.5)
      .setDepth(10002);

    const nameText = scene.add
      .text(x - cardWidth / 2 + 50, y - 25, `⚡ ${recipe.name}`, {
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#ffd700'
      })
      .setOrigin(0, 0.5)
      .setDepth(10002);

    const ingredients = recipe.ingredients
      .map((ing) => ing.name || 'Unknown')
      .join(' + ');

    const ingredientsText = scene.add
      .text(x - cardWidth / 2 + 50, y - 5, `Materials: ${ingredients}`, {
        fontSize: '10px',
        color: '#e1bee7',
        wordWrap: { width: cardWidth - 60 }
      })
      .setOrigin(0, 0.5)
      .setDepth(10002);

    const resultText = scene.add
      .text(
        x - cardWidth / 2 + 50,
        y + 15,
        `→ ${recipe.result.name || 'Legendary Item'}`,
        {
          fontSize: '12px',
          color: '#ffffff',
          fontStyle: 'bold'
        }
      )
      .setOrigin(0, 0.5)
      .setDepth(10002);

    const container = scene.add
      .container(0, 0, [cardBg, icon, nameText, ingredientsText, resultText])
      .setSize(cardWidth, cardHeight);

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
