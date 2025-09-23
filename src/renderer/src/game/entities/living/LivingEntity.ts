import { Entity } from '../../../game/entities/Entity';
import { HealthManager } from '../../managers';

export abstract class LivingEntity extends Entity {
  name: string;
  healthManager: HealthManager;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    name: string,
    texture: string
  ) {
    super(scene, x, y, texture);
    this.name = name;
  }
}
