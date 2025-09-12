import { randomInt } from '../../utils/random';
import { LivingEntity } from './LivingEntity';
import * as Weapons from '../../weapons';
import { ItemSelect, WeaponConstructor } from '../../ui/components/ItemSelect';
import { Game } from '../../scenes/Game';
import { HealthBar } from '../../ui/components/HealthBar';
import { Weapon } from '../../weapons';

/**
 * Player 클래스
 * 플레이어 캐릭터 나타내는 클래스임
 */
export class Player extends LivingEntity {
  speed: number;
  exp: number;
  level: number;
  weapons: Weapon[];
  fireCooldown: number;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  keys: Record<string, Phaser.Input.Keyboard.Key>;
  healthBar: HealthBar;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    maxHp: number,
    speed = 200,
    exp = 0,
    level = 1,
    weapons: Weapon[]
  ) {
    super(scene, x, y, 'player', maxHp);
    this.speed = speed;
    this.exp = exp;
    this.level = level;
    this.weapons = weapons;
    this.fireCooldown = 0;

    this.healthBar = new HealthBar(scene, x, y - 40, maxHp);

    scene.physics.add.existing(this.sprite);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(
      true
    );

    scene.events.on('postupdate', () => {
      this.healthBar.setHealth(this.hp);
      this.healthBar.setPosition(this.sprite.x, this.sprite.y - 40);
    });

    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.keys = {
      w: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
  }

  update(_time: number, delta: number): void {
    const dt = delta / 1000;
    let vx = 0;
    let vy = 0;

    if (this.keys.w.isDown || this.cursors.up.isDown) vy = -this.speed;
    if (this.keys.s.isDown || this.cursors.down.isDown) vy = this.speed;
    if (this.keys.a.isDown || this.cursors.left.isDown) vx = -this.speed;
    if (this.keys.d.isDown || this.cursors.right.isDown) vx = this.speed;

    if (this.sprite.body instanceof Phaser.Physics.Arcade.Body)
      this.sprite.body.setVelocity(vx, vy);

    for (const weapon of this.weapons) {
      weapon.currentCooldown -= dt;

      if (weapon.currentCooldown <= 0) {
        weapon.currentCooldown += weapon.cooldown;

        weapon.attack();
      }
    }
  }

  gainExp(amount: number) {
    this.exp += amount;

    while (this.exp >= this.level * 25) {
      this.exp -= this.level * 25;
      this.level++;
      console.log(`Level Up! Current level: ${this.level}`); // PLACEHOLDER

      const weaponClasses = Object.values(Weapons).filter((item) => {
        return (
          typeof item === 'function' &&
          item.prototype &&
          item.prototype instanceof Weapon
        );
      }) as WeaponConstructor[];
      if (weaponClasses.length === 0) return;

      const choices: WeaponConstructor[] = [];
      const pool = [...weaponClasses];
      while (choices.length < 3 && pool.length > 0) {
        const index = randomInt(pool.length);
        const selected = pool.splice(index, 1);
        if (selected.length > 0) {
          choices.push(selected[0]);
        }
      }

      if (this.scene instanceof Game) this.scene.togglePuase();

      const itemSelect = new ItemSelect(this.scene, this, choices, (weapon) => {
        const existingWeapon = this.weapons.find(
          (w) => w.constructor === weapon.constructor
        );

        if (existingWeapon) {
          existingWeapon.levelUp();
        } else {
          this.weapons.push(weapon);
        }

        if (this.scene instanceof Game) this.scene.togglePuase();
        itemSelect.destroy();
      });

      this.scene.add.existing(
        itemSelect as unknown as Phaser.GameObjects.GameObject
      );
    }
  }

  protected onDeath(): void {
    this.scene.events.off('postupdate');
    this.healthBar.destroy();
    this.destroy();
    this.scene.scene.start('GameOver');
  }
}
