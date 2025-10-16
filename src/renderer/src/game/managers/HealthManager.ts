import { GAME_CONFIG } from '../constants';
import { EventBus } from '../EventBus';
import { LivingEntity } from '../entities/living';

export class HealthManager {
  entity: LivingEntity;
  maxHp: number;
  hp: number;

  constructor(entity: LivingEntity, maxHp?: number) {
    this.entity = entity;
    this.maxHp = maxHp ?? GAME_CONFIG.PLAYER.DEFAULT_MAX_HP;
    this.hp = this.maxHp;
  }

  takeDamage(amount: number) {
    this.hp = Math.max(0, this.hp - amount);

    EventBus.emit(`${this.entity.name}:${this.entity.id}:healthChanged`, {
      hp: this.hp,
      maxHp: this.maxHp
    });

    if (this.hp <= 0) {
      EventBus.emit(`${this.entity.name}:${this.entity.id}:dead`, this.entity);
    }
  }

  heal(amount: number) {
    this.hp = Math.min(this.maxHp, this.hp + amount);

    EventBus.emit(`${this.entity.name}:${this.entity.id}:healthChanged`, {
      hp: this.hp,
      maxHp: this.maxHp
    });
  }
}
