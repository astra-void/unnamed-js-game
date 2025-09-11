import { LivingEntity } from './LivingEntity';
import { Player } from './Player';

export class Enemy extends LivingEntity {
  speed: number;
  damage: number;
  target: LivingEntity;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    maxHp: number,
    damage: number,
    speed = 200,
    target: LivingEntity
  ) {
    super(scene, x, y, 'enemy', maxHp);
    this.hp = maxHp;
    this.damage = damage;
    this.speed = speed;
    this.target = target;

    scene.physics.add.existing(this.sprite);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(
      true
    );
  }

  update(_time: number, _delta: number): void {
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;

    const vx = (dx / dist) * this.speed;
    const vy = (dy / dist) * this.speed;

    (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocity(vx, vy);
  }

  protected onDeath(): void {
    this.destroy();

    if (this.target instanceof Player) this.target.gainExp(this.damage / 5);
  }
}
