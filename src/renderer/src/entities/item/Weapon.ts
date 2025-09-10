import type { Game } from '../../Game';
import { Item } from './Item';

export abstract class Weapon extends Item {
  game: Game;
  level: number;
  maxLevel: number;
  currentCooldown: number;
  cooldown: number;
  damage: number;
  speed?: number;
  lifetime?: number;

  constructor(
    name: string,
    game: Game,
    level = 1,
    maxLevel = 5,
    cooldown: number,
    damage: number,
    speed?: number,
    lifetime?: number
  ) {
    super(name);
    this.game = game;
    this.level = level;
    this.maxLevel = maxLevel;
    this.currentCooldown = cooldown;
    this.cooldown = cooldown;
    this.damage = damage;
    this.speed = speed;
    this.lifetime = lifetime;
  }

  abstract attack(x: number, y: number): void;
  abstract levelUp(): boolean;
}
