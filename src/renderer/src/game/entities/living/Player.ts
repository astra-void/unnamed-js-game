import { LivingEntity } from './LivingEntity';
import * as Weapons from '../../weapons';
import * as Items from '../../items';
import { Game } from '../../scenes/Game';
import { HealthBar } from '../../ui/components/HealthBar';
import { Weapon } from '../../weapons';
import { Item } from '../../items';
import { GAME_CONFIG } from '../../constants';
import { SelectionPanel } from '../../ui/components/SelectionPanel';
import { WeaponConstructor, ItemConstructor } from '../../types/constructors';

/**
 * Player 클래스
 * 플레이어 캐릭터 나타내는 클래스임
 */
export class Player extends LivingEntity {
  speed: number;
  exp: number;
  level: number;
  weapons: Weapon[];
  items: Item[];
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  keys: Record<string, Phaser.Input.Keyboard.Key>;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    maxHp: number,
    exp = 0,
    level = 1,
    weapons: Weapon[] = [],
    items: Item[] = []
  ) {
    super(scene, x, y, 'player', maxHp);
    this.speed = GAME_CONFIG.PLAYER.DEFAULT_SPEED;
    this.exp = exp;
    this.level = level;
    this.weapons = weapons;
    this.items = items;

    const healthBar = new HealthBar(
      scene,
      x,
      y - GAME_CONFIG.PLAYER.HEALTH_BAR_OFFSET,
      maxHp
    );
    this.scene.uiManager.addUI({
      id: 'health-bar',
      object: healthBar,
      update: () => {
        healthBar.setPosition(
          this.x,
          this.y - GAME_CONFIG.PLAYER.HEALTH_BAR_OFFSET
        );
        healthBar.setHealth(this.hp);
      }
    });

    scene.physics.add.existing(this.sprite);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(
      true
    );

    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.keys = {
      w: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
  }

  update(time: number, delta: number): void {
    const dt = delta / 1000;
    let vx = 0;
    let vy = 0;

    if (this.keys.w.isDown || this.cursors.up.isDown) vy = -this.speed;
    if (this.keys.s.isDown || this.cursors.down.isDown) vy = this.speed;
    if (this.keys.a.isDown || this.cursors.left.isDown) vx = -this.speed;
    if (this.keys.d.isDown || this.cursors.right.isDown) vx = this.speed;

    if (this.sprite.body instanceof Phaser.Physics.Arcade.Body)
      this.sprite.body.setVelocity(vx, vy);

    this.items.forEach((item) => item.update(this, time, delta));

    for (const weapon of this.weapons) {
      weapon.currentCooldown -= dt;

      if (weapon.currentCooldown <= 0) {
        weapon.currentCooldown += weapon.cooldown;

        weapon.attack();
      }
    }
  }

  gainExp(amount: number) {
    if (amount <= 0) return;

    this.exp += amount;

    const expNeeded = this.level * GAME_CONFIG.EXP_MULTIPLIER;

    while (this.exp >= expNeeded) {
      this.exp -= expNeeded;
      this.levelUp();
    }
  }

  private levelUp(): void {
    this.level++;

    console.log(`Level Up! Current level: ${this.level}`); // DEBUG

    const weaponClasses = Object.values(Weapons).filter((weapon) => {
      if (
        typeof weapon !== 'function' ||
        !weapon.prototype ||
        !(weapon.prototype instanceof Weapon)
      )
        return false;

      const temp = new (weapon as WeaponConstructor)(this.scene, this);
      const existing = this.weapons.find((w) => w.name === temp.name);
      return !existing || !existing.isMaxLevel;
    }) as WeaponConstructor[];

    const itemClasses = Object.values(Items).filter((item) => {
      if (
        typeof item !== 'function' ||
        !item.prototype ||
        !(item.prototype instanceof Item)
      )
        return false;

      const temp = new (item as ItemConstructor)(this);
      const existing = this.items.find((i) => i.name === temp.name);
      return !existing || !existing.isMaxLevel;
    }) as ItemConstructor[];

    if (weaponClasses.length === 0 && itemClasses.length === 0) return;

    let pool = [
      ...weaponClasses.map((ctor) => ({ kind: 'weapon', ctor })),
      ...itemClasses.map((ctor) => ({ kind: 'item', ctor }))
    ];
    const originalPool = [...pool];

    const selectedWeapons: WeaponConstructor[] = [];
    const selectedItems: ItemConstructor[] = [];

    while (selectedWeapons.length + selectedItems.length < 3) {
      if (pool.length === 0) {
        if (originalPool.length === 0) break;
        pool = [...originalPool];
      }

      const index = Phaser.Math.Between(0, pool.length - 1);
      const choice = pool.splice(index, 1)[0];
      if (!choice) break;

      const { kind, ctor } = choice;
      if (kind === 'weapon') {
        selectedWeapons.push(ctor as WeaponConstructor);
      } else {
        selectedItems.push(ctor as ItemConstructor);
      }
    }

    if (selectedWeapons.length + selectedItems.length === 0) return;

    if (this.scene instanceof Game) this.scene.togglePause();

    const itemSelect = new SelectionPanel(
      this.scene,
      this,
      selectedWeapons,
      selectedItems,
      (weapon) => {
        const existing = this.weapons.find((w) => w.name === weapon.name);
        if (existing) {
          existing.levelUp();
          weapon.destroy();
        } else {
          this.weapons.push(weapon);
        }

        if (this.scene instanceof Game) this.scene.togglePause();
        itemSelect.destroy();
      },
      (item) => {
        const existing = this.items.find((i) => i.name === item.name);
        if (existing) {
          existing.levelUp(this);
        } else {
          this.items.push(item);
          item.applyEffect(this);
        }

        if (this.scene instanceof Game) this.scene.togglePause();
        itemSelect.destroy();
      }
    );

    this.scene.uiManager.addUI({
      id: 'item-select',
      object: itemSelect
    });
  }

  protected onDeath(): void {
    this.weapons.forEach((weapon) => weapon.destroy());
    this.weapons = [];
    this.items = [];

    this.scene.uiManager.clear();
    this.destroy();
    this.scene.scene.start('GameOver');
  }
}
