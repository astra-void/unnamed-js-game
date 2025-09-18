import { GameObjects, Physics, Scene } from 'phaser';
import { Player } from '../entities/living';
import { GAME_CONFIG } from '../constants';

export abstract class Weapon {
  name: string;
  description: string;
  scene: Scene;
  player: Player;
  sprite: GameObjects.Sprite;
  body: Physics.Arcade.Body;
  level: number;
  currentCooldown: number;
  cooldown: number;
  damage: number;
  speed?: number;
  lifetime?: number;

  constructor(
    scene: Scene,
    name: string,
    description: string,
    player: Player,
    x: number,
    y: number,
    cooldown: number,
    damage: number,
    level = 1,
    speed?: number,
    lifetime?: number
  ) {
    this.name = name;
    this.description = description;
    this.scene = scene;
    this.player = player;
    this.level = level;
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

  get isMaxLevel() {
    return this.level >= GAME_CONFIG.MAX_WEAPON_LEVEL;
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
