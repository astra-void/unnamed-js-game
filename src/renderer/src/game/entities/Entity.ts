import { GameObjects, Scene } from 'phaser';

export abstract class Entity {
  scene: Scene;
  sprite: GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    this.scene = scene;
    this.sprite = scene.add.sprite(x, y, texture);
  }

  get x() {
    return this.sprite.x;
  }

  get y() {
    return this.sprite.y;
  }

  setPosition(x: number, y: number) {
    this.sprite.setPosition(x, y);
  }

  abstract update(time: number, delta: number): void;

  destroy() {
    this.sprite.destroy();
  }
}
