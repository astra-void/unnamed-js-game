import { EventBus } from '../../EventBus';
import { HealthManager } from '../../managers';
import { LivingEntity } from './LivingEntity';
import { Player } from './Player';

export class Enemy extends LivingEntity {
  speed: number;
  damage: number;
  target: LivingEntity;

  constructor(
    scene: Phaser.Scene,
    id: string,
    x: number,
    y: number,
    maxHp: number,
    damage: number,
    speed = 200,
    target: LivingEntity
  ) {
    super(scene, x, y, 'enemy', id, 'enemy');
    this.damage = damage;
    this.speed = speed;
    this.target = target;

    this.healthManager = new HealthManager(this, maxHp);

    scene.physics.add.existing(this.sprite);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(
      true
    );

    EventBus.once(`enemy:${this.id}:dead`, () => {
      this.destroy();
      if (this.target instanceof Player)
        this.target.levelManager.gainExp(this.damage / 5);
      super.destroy();
    });
  }

  update(_time: number, _delta: number): void {
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;

    const vx = (dx / dist) * this.speed;
    const vy = (dy / dist) * this.speed;

    (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocity(vx, vy);
  }
}
