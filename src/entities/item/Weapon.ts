import { Item } from "./Item";
import type { Projectile } from "../projectiles/Projectile";

export abstract class Weapon extends Item {
    damage: number;

    constructor(name: string, damage: number) {
        super(name);
        this.damage = damage;
    }

    abstract attack(): Projectile | null;
}
