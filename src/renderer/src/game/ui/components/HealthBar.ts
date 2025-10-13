import { GameObjects } from 'phaser';
import { GAME_CONFIG } from '../../constants';
import { EventBus } from '../../EventBus';
import { LivingEntity } from '../../entities/living';
import { UIComponent } from '../../types/ui';

export class HealthBar implements UIComponent {
  id = 'healthBar';
  object: GameObjects.GameObject;
  private container: Phaser.GameObjects.Container;
  private bar: Phaser.GameObjects.Graphics;
  private bg: Phaser.GameObjects.Graphics;
  private maxHp: number;
  private currentHp: number;
  private entity: LivingEntity;

  constructor(scene: Phaser.Scene, entity: LivingEntity, maxHp: number) {
    this.entity = entity;
    this.maxHp = maxHp;
    this.currentHp = maxHp;

    this.bg = scene.add.graphics();
    this.bar = scene.add.graphics();
    this.container = scene.add.container(entity.sprite.x, entity.sprite.y, [
      this.bg,
      this.bar
    ]);
    this.object = this.container;

    this.draw();

    EventBus.on('player:healthChanged', ({ hp }: { hp: number }) =>
      this.setHp(hp)
    );
  }

  setHp(value: number) {
    this.currentHp = Phaser.Math.Clamp(value, 0, this.maxHp);
    this.draw();
  }

  private draw() {
    this.bg.clear().fillStyle(0x555555).fillRect(-25, -3, 50, 6);

    const ratio = this.currentHp / this.maxHp;
    this.bar
      .clear()
      .fillStyle(0xff0000)
      .fillRect(-25, -3, 50 * ratio, 6);
  }

  update(_time: number, _delta: number) {
    this.container.setPosition(
      this.entity.sprite.x,
      this.entity.sprite.y - GAME_CONFIG.PLAYER.HEALTH_BAR_OFFSET
    );
  }

  destroy() {
    this.container.destroy(true);
  }
}
