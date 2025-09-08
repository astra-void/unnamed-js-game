import { Entity } from '../Entity';

/**
 * LivingEntity는 HP 가지는 엔티티의 추상 클래스임
 * Entity 상속받아서 위치(x, y), HP 관련 기능 제공함
 */
export abstract class LivingEntity extends Entity {
  hp: number;
  maxHp: number;

  /**
   * 대충 LivingEntity 생성하는거
   * @param x - x 좌표
   * @param y - y 좌표
   * @param maxHp - 최대 체력
   * @constructor
   */
  constructor(x: number, y: number, maxHp: number) {
    super(x, y);
    this.maxHp = maxHp;
    this.hp = maxHp;
  }

  /**
   * 체력 감소 시켜주는 함수
   * @param amount - 감소량
   */
  takeDamage(amount: number) {
    this.hp = Math.max(this.hp - amount, 0);
    if (this.hp === 0) {
      this.onDeath();
    }
  }

  /**
   * 체력 회복 시켜주는 함수
   * @param amount - 회복량
   */
  heal(amount: number) {
    this.hp = Math.min(this.hp + amount, this.maxHp);
  }

  /**
   * 죽음 처리 (오버라이드 가능)
   * 엔티티 죽었을 때 호출됨
   */
  protected onDeath() {}
}
