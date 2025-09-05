import type { Game } from "../../Game";
import { Item } from "./Item";

export abstract class Weapon extends Item {
    game: Game;
    currentCooldown: number;
    cooldown: number;
    damage: number;
    speed?: number;
    lifetime?: number;

    constructor(name: string, game: Game, cooldown: number, damage: number, speed?: number, lifetime?: number) {
        super(name);
        this.game = game;
        this.currentCooldown = cooldown;
        this.cooldown = cooldown;
        this.damage = damage;
        this.speed = speed;
        this.lifetime = lifetime;
    }

    abstract attack(x: number, y: number): void;
}
