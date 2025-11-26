import { GameObjects, Physics, Scene } from 'phaser';
import { GAME_CONFIG } from '../constants';
import { Player } from '../entities/living';

export abstract class Weapon {
  name: string;
  description: string;
  scene: Scene;
  player: Player;
  sprite: GameObjects.Sprite;
  body: Physics.Arcade.Body;
  level: number = 0;
  currentCooldown: number;
  cooldown: number;
  damage: number;
  texture: string;
  speed?: number;
  lifetime?: number;

  constructor(
    scene: Scene,
    name: string,
    description: string,
    texture: string,
    player: Player,
    cooldown: number,
    damage: number,
    speed?: number,
    lifetime?: number
  ) {
    this.name = name;
    this.description = description;
    this.scene = scene;
    this.player = player;
    this.currentCooldown = cooldown;
    this.cooldown = cooldown;
    this.damage = damage;
    this.texture = texture;
    this.speed = speed;
    this.lifetime = lifetime;

    this.sprite = scene.add.sprite(0, 0, texture);
    scene.physics.add.existing(this.sprite);
    this.body = this.sprite.body as Physics.Arcade.Body;

    this.body.setCollideWorldBounds(true).onWorldBounds = true;
    this.sprite.setVisible(false);
  }

  get isMaxLevel() {
    return this.level >= GAME_CONFIG.MAX_WEAPON_LEVEL;
  }

  abstract attack(): void;

  levelUp() {
    if (!this.isMaxLevel) {
      this.level++;
      this.onLevelUp();
    }
  }

  protected onLevelUp(): void {}

  destroy() {
    this.sprite.destroy();
  }

  setPosition(x: number, y: number) {
    this.sprite.setPosition(x, y);
  }
}