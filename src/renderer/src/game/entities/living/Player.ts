import { Weapon } from '../../../game/entities/item';
import { LivingEntity } from './LivingEntity';

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

  update(_time: number, delta: number): void {
    const dt = delta / 1000;
    let vx = 0;
    let vy = 0;

    if (this.keys.w.isDown || this.cursors.up.isDown) vy = -this.speed;
    if (this.keys.s.isDown || this.cursors.down.isDown) vy = this.speed;
    if (this.keys.a.isDown || this.cursors.left.isDown) vx = -this.speed;
    if (this.keys.d.isDown || this.cursors.right.isDown) vx = this.speed;

    (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocity(vx, vy);

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

      /*
      const weaponClasses = Object.values(Weapons).filter(
        (item): item is new (game: Game) => Weapon => {
          return (
            typeof item === 'function' &&
            item.prototype &&
            item.prototype instanceof Weapon
          );
        }
      );
      if (weaponClasses.length === 0) return;

      const choices: (new (game: Game) => Weapon)[] = [];
      const pool = [...weaponClasses];
      while (choices.length < 3 && pool.length > 0) {
        const index = randomInt(pool.length);
        const selected = pool.splice(index, 1);
        if (selected.length > 0) {
          choices.push(selected[0]);
        }
      }

      this.game.togglePause();

      const itemSelect = new ItemSelect(choices, this.game, (weapon) => {
        const existingWeapon = this.weapons.find(
          (w) => w.constructor === weapon.constructor
        );

        if (existingWeapon) {
          existingWeapon.levelUp();
        } else {
          this.weapons.push(weapon);
        }

        this.game.ui.removeCanvasUI(itemSelect);
      });

      this.game.ui.addCanvasUI(itemSelect);
    }
    */
    }
  }
}
