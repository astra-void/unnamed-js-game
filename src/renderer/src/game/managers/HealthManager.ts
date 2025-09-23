import { LivingEntity } from '../entities/living';
import { EventBus } from '../EventBus';

export class HealthManager {
  entitiy: LivingEntity;
  hp: number;
  maxHp: number;

  constructor(entity: LivingEntity, maxHp = 100) {
    this.entitiy = entity;
    this.maxHp = maxHp;
    this.hp = maxHp;
  }

  takeDamage(amount: number) {
    this.hp = Math.max(0, this.hp - amount);
    EventBus.emit(`${this.entitiy.name}:healthChanged`, {
      hp: this.hp,
      maxHp: this.maxHp
    });
    if (this.hp <= 0) {
      EventBus.emit(`${this.entitiy.name}:dead`, this.entitiy);
    }
  }

  heal(amount: number) {
    this.hp = Math.min(this.maxHp, this.hp + amount);

    EventBus.emit(`${this.entitiy.name}:healthChanged`, {
      hp: this.hp,
      maxHp: this.maxHp
    });
  }
}
