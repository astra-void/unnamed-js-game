import { Entity } from '../entities/Entity';
import { Game } from '../scenes/Game';

export class InstanceManager {
  game: Game;
  instances: Map<string, Phaser.GameObjects.GameObject>;

  constructor(game: Game) {
    this.game = game;
    this.instances = new Map();
  }

  add(name: string, instance: Phaser.GameObjects.GameObject) {
    if (!this.instances) {
      this.instances = new Map();
    }
    this.instances.set(name, instance);
  }

  get(name: string) {
    return this.instances.get(name);
  }

  remove(name: string) {
    const instance = this.instances.get(name);
    if (instance) {
      instance.destroy();
      this.instances.delete(name);
    }
  }

  update(time: number, delta: number) {
    this.instances.forEach((instance) => {
      if (instance instanceof Entity) {
        instance.sprite.update(time, delta);
      }
    });
  }
}
