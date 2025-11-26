import { Entity } from '../../../game/entities/Entity';
import { HealthManager } from '../../managers';

export abstract class LivingEntity extends Entity {
  id: string;
  name: string;
  healthManager: HealthManager;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    name: string,
    id: string,
    texture: string
  ) {
    super(scene, x, y, texture);
    this.id = id;
    this.name = name;
  }
}