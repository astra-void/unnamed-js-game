import { GameObjects, Physics, Scene } from 'phaser';

export abstract class Weapon {
  name: string;
  scene: Scene;
  sprite: GameObjects.Sprite;
  body: Physics.Arcade.Body;
  level: number;
  maxLevel: number;
  currentCooldown: number;
  cooldown: number;
  damage: number;
  speed?: number;
  lifetime?: number;

  constructor(
    scene: Scene,
    name: string,
    x: number,
    y: number,
    cooldown: number,
    damage: number,
    level = 1,
    maxLevel = 5,
    speed?: number,
    lifetime?: number
  ) {
    this.name = name;
    this.scene = scene;
    this.level = level;
    this.maxLevel = maxLevel;
    this.currentCooldown = cooldown;
    this.cooldown = cooldown;
    this.damage = damage;
    this.speed = speed;
    this.lifetime = lifetime;

    this.sprite = scene.add.sprite(x, y, '1');
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Physics.Arcade.Body;

    this.body.setCollideWorldBounds(true).onWorldBounds = true;
    this.sprite.setVisible(false);
  }

  abstract attack(): void;
  abstract levelUp(): boolean;

  destroy() {
    this.sprite.destroy();
  }

  setPosition(x: number, y: number) {
    this.sprite.setPosition(x, y);
  }
}
