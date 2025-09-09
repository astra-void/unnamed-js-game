import type { Game } from '../../Game';
import { Weapon } from '../item';
import { LivingEntity } from './LivingEntity';
import * as Items from '../item';
import { ItemSelect } from '../../ui/components/';
import { randomInt } from '../../utils/random';

/**
 * Player 클래스
 * 플레이어 캐릭터 나타내는 클래스임
 */
export class Player extends LivingEntity {
  radius: number;
  speed: number;
  exp: number;
  level: number;
  weapons: Weapon[];
  fireCooldown: number;
  game: Game;

  /**
   *
   * @param x
   * @param y
   * @param maxHp
   * @param radius
   * @param speed
   * @param exp
   * @param level
   * @param weapons
   * @param game
   * @constructor
   */
  constructor(
    x: number,
    y: number,
    maxHp: number,
    radius = 16,
    speed = 200,
    exp = 0,
    level = 1,
    weapons: Weapon[],
    game: Game
  ) {
    super(x, y, maxHp);
    this.radius = radius;
    this.speed = speed;
    this.exp = exp;
    this.level = level;
    this.weapons = weapons;
    this.game = game;
    this.fireCooldown = 0;
  }

  /**
   * 상태 업데이트
   * @param dt - 프레임 간 시간(초)
   */
  update(dt: number): void {
    if (this.game.keys['w'] || this.game.keys['ArrowUp'])
      this.y -= this.speed * dt;
    if (this.game.keys['s'] || this.game.keys['ArrowDown'])
      this.y += this.speed * dt;
    if (this.game.keys['a'] || this.game.keys['ArrowLeft'])
      this.x -= this.speed * dt;
    if (this.game.keys['d'] || this.game.keys['ArrowRight'])
      this.x += this.speed * dt;

    const radius = this.radius;
    const canvas = this.game.canvas;

    if (this.x < radius) this.x = radius;
    if (this.x > canvas.width - radius) this.x = canvas.width - radius;
    if (this.y < radius) this.y = radius;
    if (this.y > canvas.height - radius) this.y = canvas.height - radius;

    for (const weapon of this.weapons) {
      weapon.currentCooldown -= dt;

      if (weapon.currentCooldown <= 0) {
        weapon.currentCooldown += weapon.cooldown;

        weapon.attack(this.x, this.y);
      }
    }
  }

  gainExp(amount: number) {
    this.exp += amount;

    while (this.exp >= this.level * 25) {
      this.exp -= this.level * 25;
      this.level++;
      console.log(`Level Up! Current level: ${this.level}`); // PLACEHOLDER

      const weaponClasses = Object.values(Items).filter((ItemClass) => {
        try {
          const instance = new (ItemClass as any)(this.game);
          return instance.attack && instance instanceof Weapon;
        } catch {
          return false;
        }
      }) as (new (game: Game) => Weapon)[];

      if (weaponClasses.length === 0) return;

      const choices: (new (game: Game) => Weapon)[] = [];
      const pool = [...weaponClasses];
      while (choices.length < 3 && pool.length > 0) {
        const index = randomInt(pool.length);
        choices.push(pool.splice(index, 1)[0]);
      }

      const itemSelect = new ItemSelect(choices, this.game, (weapon) => {
        if (!this.weapons.some(w => w.constructor === weapon.constructor)) {
          this.weapons.push(weapon);
        }
        this.game.ui.removeCanvasUI(itemSelect);
      });

      this.game.ui.addCanvasUI(itemSelect);

      console.log(this.weapons); // FOR DEBUG
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
