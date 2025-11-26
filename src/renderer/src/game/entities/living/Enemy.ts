import { GAME_CONFIG } from '../../constants';
import { EventBus } from '../../EventBus';
import { HealthManager } from '../../managers';
import { LivingEntity } from './LivingEntity';
import { Player } from './Player';

export class Enemy extends LivingEntity {
  baseSpeed: number;
  speed: number;
  damage: number;
  target: LivingEntity;
  speedMultiplier: number = 1;

  stunned: boolean = false;
  stunTimer: number = 0;

  constructor(
    scene: Phaser.Scene,
    id: string,
    x: number,
    y: number,
    maxHp: number,
    damage: number,
    speed = GAME_CONFIG.ENEMY.DEFAULT_SPEED,
    target: LivingEntity
  ) {
    super(scene, x, y, 'enemy', id, 'enemy');
    this.damage = damage;
    this.baseSpeed = speed;
    this.speed = speed;
    this.target = target;

    this.healthManager = new HealthManager(this, maxHp);

    scene.physics.add.existing(this.sprite);
    (this.sprite.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(
      true
    );

    EventBus.on(
      `enemy:${this.id}:healthChanged`,
      ({ isDead }: { isDead: boolean }) => {
        if (isDead) {
          this.destroy();
          if (this.target instanceof Player)
            this.target.levelManager.gainExp(this.damage / 5);
          super.destroy();
        }
      }
    );
  }

  applyStun(duration: number) {
    this.stunned = true;
    this.stunTimer = duration;

    this.sprite.setTint(0x87cefa);
  }

  update(_time: number, delta: number): void {
    if (this.stunned) {
      this.stunTimer -= delta;
      (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);

      if (this.stunTimer <= 0) {
        this.stunned = false;
        this.sprite.clearTint();
      }
      return;
    }

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;

    const vx = (dx / dist) * this.speed * this.speedMultiplier;
    const vy = (dy / dist) * this.speed * this.speedMultiplier;

    (this.sprite.body as Phaser.Physics.Arcade.Body).setVelocity(vx, vy);
  }
}