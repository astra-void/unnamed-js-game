import { GAME_CONFIG } from '../constants';
import { EventBus } from '../EventBus';
import { LivingEntity } from '../entities/living';

export class HealthManager {
  entity: LivingEntity;
  maxHp: number;
  hp: number;
  private isDead: boolean = false;

  constructor(entity: LivingEntity, maxHp?: number) {
    this.entity = entity;
    this.maxHp = maxHp ?? GAME_CONFIG.PLAYER.DEFAULT_MAX_HP;
    this.hp = this.maxHp;

    this.emitHealthChanged();
  }

  private emitHealthChanged() {
    EventBus.emit(`${this.entity.name}:${this.entity.id}:healthChanged`, {
      hp: this.hp,
      maxHp: this.maxHp
    });
  }

  takeDamage(amount: number) {
    if (this.isDead || amount < 0) return;

    this.hp = Math.max(0, this.hp - amount);
    this.emitHealthChanged();
    
    if (this.hp <= 0 && !this.isDead) {
      this.isDead = true;
      EventBus.emit(`${this.entity.name}:${this.entity.id}:dead`, this.entity);
    }
  }

  heal(amount: number) {
    if (this.isDead || amount < 0) return;

    this.hp = Math.min(this.maxHp, this.hp + amount);
    this.emitHealthChanged();
  }

  setMaxHp(newMaxHp: number) {
    if (newMaxHp <= 0) return;
    
    const hpRatio = this.hp / this.maxHp;
    this.maxHp = newMaxHp;
    this.hp = Math.min(this.maxHp, Math.floor(this.maxHp * hpRatio));
    this.emitHealthChanged();
  }

  revive(hpPercent: number = 1) {
    this.isDead = false;
    this.hp = Math.floor(this.maxHp * Math.max(0, Math.min(1, hpPercent)));
    this.emitHealthChanged();
  }
}
