import { Entity } from '../../../game/entities/Entity';

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
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    maxHp: number
  ) {
    super(scene, x, y, texture);
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
   */
  protected onDeath() {
    this.destroy();
  }
}
