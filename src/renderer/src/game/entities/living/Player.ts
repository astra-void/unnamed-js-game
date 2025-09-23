import { LivingEntity } from './LivingEntity';
import * as Weapons from '../../weapons';
import * as Items from '../../items';
import { Game } from '../../scenes/Game';
import { Weapon } from '../../weapons';
import { Item } from '../../items';
import { GAME_CONFIG } from '../../constants';
import { WeaponConstructor, ItemConstructor } from '../../types/constructors';
import { FusionRecipe } from '../../fusion';
import { EventBus } from '../../EventBus';
import {
  WeaponManager,
  ItemManager,
  LevelManager,
  HealthManager,
  UIManager
} from '../../managers';
import { HealthBar } from '../../ui/components/HealthBar';
import { SelectionPanel } from '../../ui/components/SelectionPanel';

type Candidate = {
  kind: 'weapon' | 'item' | 'fusion';
  value: WeaponConstructor | ItemConstructor | FusionRecipe;
};

export class Player extends LivingEntity {
  speed: number;
  exp: number;
  level: number;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  keys: Record<string, Phaser.Input.Keyboard.Key>;

  weaponManager: WeaponManager;
  itemManager: ItemManager;
  levelManager: LevelManager;
  uiManager: UIManager;

  constructor(scene: Game, x: number, y: number, maxHp: number) {
    super(scene, x, y, 'player', 'player');
    this.speed = GAME_CONFIG.PLAYER.DEFAULT_SPEED;

    this.initializeManagers(maxHp);
    this.setupPhysics();
    this.setupControls();
    this.setupEventListeners();
  }

  private initializeManagers(maxHp: number) {
    this.weaponManager = new WeaponManager(this, this.scene);
    this.itemManager = new ItemManager(this, this.scene);
    this.levelManager = new LevelManager(this, this.scene as Game);
    this.healthManager = new HealthManager(this, maxHp);
    this.uiManager = this.scene.uiManager;

    const hpBar = new HealthBar(this.scene, this, this.healthManager.maxHp);
    this.uiManager.add(hpBar);
  }

  private setupPhysics() {
    this.scene.physics.add.existing(this.sprite);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(
      true
    );
  }

  private setupControls() {
    const keyboard = this.scene.input.keyboard!;
    this.cursors = keyboard.createCursorKeys();
    this.keys = {
      w: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
  }

  private setupEventListeners() {
    EventBus.on('player:levelUp', this.handleLevelUp.bind(this));
    EventBus.on('player:dead', () => this.handleDeath.bind(this));
  }

  private handleDeath() {
    this.weaponManager.clear();
    this.itemManager.clear();
    this.scene.uiManager.clear();
    this.destroy();
    this.scene.scene.start('GameOver');
  }

  private handleLevelUp() {
    if (!(this.scene instanceof Game)) return;

    this.scene.pauseGame();

    const candidates = this.getCandidates();

    if (!candidates || candidates.length === 0) return;

    const selected = this.selectRandomCandidates(candidates, 3);
    this.showSelectionPanel(selected);
  }

  private getCandidates() {
    if (!(this.scene instanceof Game)) return;

    const weapons = this.getAvailableWeapons();
    const items = this.getAvailableItems();
    const fusions = this.scene.fusionManager.getAvailableFusionsForMaxLevel();

    return [
      ...weapons.map((w) => ({ kind: 'weapon' as const, value: w })),
      ...items.map((i) => ({ kind: 'item' as const, value: i })),
      ...fusions.map((f) => ({ kind: 'fusion' as const, value: f }))
    ] as Candidate[];
  }

  private getAvailableWeapons(): WeaponConstructor[] {
    return Object.values(Weapons).filter((w) => {
      if (
        typeof w !== 'function' ||
        !w.prototype ||
        !(w.prototype instanceof Weapon)
      )
        return false;
      const temp = new (w as WeaponConstructor)(this.scene, this);
      const existing = this.weaponManager.findWeapon(temp.name);
      return !existing || !existing.isMaxLevel;
    }) as WeaponConstructor[];
  }

  private getAvailableItems(): ItemConstructor[] {
    return Object.values(Items).filter((i) => {
      if (
        typeof i !== 'function' ||
        !i.prototype ||
        !(i.prototype instanceof Item)
      )
        return false;
      const temp = new (i as ItemConstructor)(this);
      const existing = this.itemManager.findItem(temp.name);
      return !existing || !existing.isMaxLevel;
    }) as ItemConstructor[];
  }

  private selectRandomCandidates<T>(arr: T[], max: number): T[] {
    const copy = [...arr];
    const selected: T[] = [];
    while (selected.length < max && copy.length > 0) {
      const index = Phaser.Math.Between(0, copy.length - 1);
      selected.push(copy.splice(index, 1)[0]);
    }
    return selected;
  }

  private showSelectionPanel(candidates: Candidate[]) {
    const weapons = candidates
      .filter((c) => c.kind === 'weapon')
      .map((c) => c.value) as WeaponConstructor[];
    const items = candidates
      .filter((c) => c.kind === 'item')
      .map((c) => c.value) as ItemConstructor[];
    const fusions = candidates
      .filter((c) => c.kind === 'fusion')
      .map((c) => c.value) as FusionRecipe[];

    const selectionPanel = new SelectionPanel(
      this.scene,
      this,
      weapons,
      items,
      fusions
    );
    this.uiManager.add({
      id: 'selection-panel',
      object: selectionPanel,
      destroy: () => selectionPanel.destroy()
    });

    this.setupSelectionHandlers(selectionPanel);
  }

  private setupSelectionHandlers(selectionPanel: SelectionPanel) {
    const handleSelection = () => {
      if (!(this.scene instanceof Game)) return;
      selectionPanel.destroy();
      this.scene.resumeGame();
    };

    EventBus.once('selection:weapon', (weapon: Weapon) => {
      if (!(this.scene instanceof Game)) return;
      const existing = this.weaponManager.findWeapon(weapon.name);
      if (existing) {
        existing.levelUp(this);
      } else {
        weapon.levelUp(this);
        this.weaponManager.addWeapon(weapon);
      }
      handleSelection();
    });

    EventBus.once('selection:item', (item: Item) => {
      if (!(this.scene instanceof Game)) return;
      const existing = this.itemManager.findItem(item.name);
      if (existing) {
        existing.levelUp(this);
      } else {
        item.levelUp(this);
        this.itemManager.addItem(item);
        item.applyEffect(this);
      }
      handleSelection();
    });

    EventBus.once('selection:fusion', (recipe: FusionRecipe) => {
      if (!(this.scene instanceof Game)) return;
      const result = this.scene.fusionManager.fuse(recipe);
      console.log(result ? `Fusion Success: ${result.name}` : 'Fusion failed');
      handleSelection();
    });
  }

  update(time: number, delta: number): void {
    this.handleMovement();

    this.itemManager.update(time, delta);
    this.weaponManager.attack(delta / 1000);
  }

  private handleMovement() {
    let vx = 0,
      vy = 0;

    if (this.keys.w.isDown || this.cursors.up.isDown) vy = -this.speed;
    if (this.keys.s.isDown || this.cursors.down.isDown) vy = this.speed;
    if (this.keys.a.isDown || this.cursors.left.isDown) vx = -this.speed;
    if (this.keys.d.isDown || this.cursors.right.isDown) vx = this.speed;

    if (this.sprite.body instanceof Phaser.Physics.Arcade.Body) {
      this.sprite.body.setVelocity(vx, vy);
    }
  }

  attemptFusion(recipe: FusionRecipe): boolean {
    if (!(this.scene instanceof Game)) return false;
    const result = this.scene.fusionManager.fuse(recipe);
    if (result) {
      console.log(`Fusion Success: ${result.name} created!`);
      return true;
    } else {
      console.log('Fusion failed: Required ingredients not available');
      return false;
    }
  }
}
