import { Entity } from '../entities/Entity';
import { Game } from '../scenes/Game';
import { isEntitySprite } from '../types/typeGuards';

type InstanceLike = Phaser.GameObjects.GameObject | Entity;

export class InstanceManager {
  game: Game;
  instances: Map<string, InstanceLike>;
  private idCounter = 0;

  constructor(game: Game) {
    this.game = game;
    this.instances = new Map();
  }

  add(instance: InstanceLike, name?: string) {
    if (!this.instances) {
      this.instances = new Map();
    }

    const target = instance instanceof Entity ? instance.sprite : instance;

    let instanceName: string;

    if (name !== undefined && name !== null) {
      instanceName = name;
    } else if (target.name) {
      instanceName = target.name;
    } else {
      this.idCounter += 1;
      instanceName = `instance-${this.idCounter}`;
    }

    target.name = instanceName;
    this.instances.set(instanceName, instance);
    this.game.add.existing(target);

    target.once('destroy', () => {
      this.instances.delete(instanceName);
    });
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
        instance.update(time, delta);
        return;
      }

      if (isEntitySprite(instance) && instance.entity instanceof Entity) {
        instance.entity.update(time, delta);
      }
    });
  }
}
