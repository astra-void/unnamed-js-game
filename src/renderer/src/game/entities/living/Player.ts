import { GAME_CONFIG } from '../../constants';
import { EventBus } from '../../EventBus';
import * as Items from '../../items';
import { Item } from '../../items';
import {
  HealthManager,
  ItemManager,
  LevelManager,
  UIManager,
  WeaponManager
} from '../../managers';
import { Game } from '../../scenes/Game';
import { ItemConstructor, WeaponConstructor } from '../../types/constructors';
import { HUDPanel } from '../../ui/components/HUDPanel';
import { CardContent } from '../../ui/components/InfoCard';
import { SelectionPanel } from '../../ui/components/SelectionPanel';
import * as Weapons from '../../weapons';
import { Weapon } from '../../weapons';
import { LivingEntity } from './LivingEntity';

type Candidate = {
  kind: 'weapon' | 'item';
  value: WeaponConstructor | ItemConstructor;
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

  attackSpeedMultiplier = 1;
  damageMultiplier = 1;
  projectileSizeMultiplier = 1;

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 'player', 'player', 'player');
    this.speed = GAME_CONFIG.PLAYER.DEFAULT_SPEED;

    this.initializeManagers();
    this.setupPhysics();
    this.setupControls();
    this.setupEventListeners();
    this.setupUI();
  }

  private initializeManagers() {
    this.weaponManager = new WeaponManager(this, this.scene);
    this.itemManager = new ItemManager(this, this.scene);
    this.levelManager = new LevelManager(this, this.scene as Game);
    this.healthManager = new HealthManager(this);
    this.uiManager = this.scene.uiManager;
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
    EventBus.on(`player:${this.id}:levelUp`, this.handleLevelUp.bind(this));
    EventBus.on(
      `player:${this.id}:healthChanged`,
      ({ isDead }: { isDead: boolean }) => {
        if (isDead) this.handleDeath();
      }
    );
  }

  private setupUI() {
    const hud = new HUDPanel(this.scene, 20, 40, this.id);
    hud.updateData({
      health: this.healthManager.hp,
      maxHealth: this.healthManager.maxHp,
      level: this.levelManager.level,
      experience: this.levelManager.exp,
      maxExperience: this.levelManager.nextLevelExp
    });

    this.uiManager.add(hud);
  }

  private handleDeath() {
    EventBus.off(`player:${this.id}:levelUp`);
    EventBus.off(`player:${this.id}:healthChanged`);

    this.weaponManager.clear();
    this.itemManager.clear();
    this.scene.uiManager.clear();
    this.destroy();

    const elapsedSeconds = (
      this.scene as Game
    ).timerManager.getElapsedSeconds();

    this.scene.scene.start('GameOver', {
      survivedTime: elapsedSeconds
    });
  }

  private handleLevelUp() {
    (this.scene as Game).pauseGame();

    const candidates = this.getCandidates();

    if (!candidates || candidates.length === 0) return;

    const selected = this.selectRandomCandidates(candidates, 3);
    this.showSelectionPanel(selected);
  }

  private getCandidates() {
    const weapons = this.getAvailableWeapons();
    const items = this.getAvailableItems();

    return [
      ...weapons.map((w) => ({ kind: 'weapon' as const, value: w })),
      ...items.map((i) => ({ kind: 'item' as const, value: i }))
    ] as Candidate[];
  }

  private getAvailable<C extends WeaponConstructor | ItemConstructor>(
    type: 'weapon' | 'item'
  ): C[] {
    const isWeapon = type === 'weapon';
    const items = isWeapon ? Weapons : Items;
    const baseClass = isWeapon ? Weapon : Item;
    const findMethod = isWeapon
      ? (name: string) => this.weaponManager.find(name)
      : (name: string) => this.itemManager.find(name);

    return Object.values(items).filter((item) => {
      if (
        typeof item !== 'function' ||
        !item.prototype ||
        !(item.prototype instanceof baseClass)
      )
        return false;

      const temp = isWeapon
        ? new (item as WeaponConstructor)(this.scene, this)
        : new (item as ItemConstructor)();
      const existing = findMethod(temp.name);
      if (isWeapon && 'destroy' in temp && typeof temp.destroy === 'function') {
        (temp as Weapon).destroy();
      }
      return !existing || !existing.isMaxLevel;
    }) as C[];
  }

  private getAvailableWeapons(): WeaponConstructor[] {
    return this.getAvailable<WeaponConstructor>('weapon');
  }

  private getAvailableItems(): ItemConstructor[] {
    return this.getAvailable<ItemConstructor>('item');
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
    const choices: CardContent[] = candidates.map((candidate) => {
      if (candidate.kind === 'weapon') {
        const WpnCtor = candidate.value as WeaponConstructor;
        const tempWeapon = new WpnCtor(this.scene, this);
        const existing = this.weaponManager.find(tempWeapon.name);
        const baseDescription = tempWeapon.description;
        const progressDescription = existing
          ? `레벨업! (Lv.${existing.level} -> Lv.${existing.level + 1})`
          : '새로운 무기';
        const card: CardContent = {
          title: tempWeapon.name,
          description: `${baseDescription}\n\n${progressDescription}`,
          icon: tempWeapon.texture
        };
        tempWeapon.destroy();
        return card;
      }

      const ItmCtor = candidate.value as ItemConstructor;
      const tempItem = new ItmCtor();
      const existing = this.itemManager.find(tempItem.name);
      const nextLevel = (existing ?? tempItem).level + 1;
      const progressDescription = existing
        ? `레벨업! (Lv.${existing.level} -> Lv.${existing.level + 1})`
        : '새로운 아이템';

      return {
        title: tempItem.name,
        description: `${tempItem.description}\n\n${progressDescription}`,
        icon: (existing ?? tempItem).getTextureForLevel(nextLevel)
      };
    });

    const selectionPanel = new SelectionPanel(this.scene, choices, {
      onSelect: (index: number) => {
        const selected = candidates[index];
        if (!selected) {
          return;
        }

        switch (selected.kind) {
          case 'weapon': {
            const WpnCtor = selected.value as WeaponConstructor;
            const weapon = new WpnCtor(this.scene, this);
            const existing = this.weaponManager.find(weapon.name);
            if (existing) {
              existing.levelUp();
              weapon.destroy();
            } else {
              weapon.levelUp();
              this.weaponManager.add(weapon);
            }
            break;
          }
          case 'item': {
            const ItmCtor = selected.value as ItemConstructor;
            const item = new ItmCtor();
            const existing = this.itemManager.find(item.name);
            if (existing) {
              existing.levelUp(this);
            } else {
              item.levelUp(this);
              this.itemManager.add(item);
              item.applyEffect(this);
            }
            break;
          }
        }
      },
      onClose: () => {
        (this.scene as Game).resumeGame();
      }
    });

    this.uiManager.add({
      id: 'selection-panel',
      object: selectionPanel,
      destroy: () => selectionPanel.destroy()
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
}
