import { Projectile } from "../projectiles";
import { Item } from "./Item";

export abstract class Weapon extends Item {
    damage: number;

    constructor(name: string, damage: number) {
        super(name);
        this.damage = damage;
    }

    abstract attack(): Projectile | null;
}
