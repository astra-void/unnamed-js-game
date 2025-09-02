import { KnifeProjectile, type Projectile } from "../projectiles";
import { Weapon } from "./Weapon";

export class Knife extends Weapon {
    constructor() {
        super("Knife", 10);
    }

    attack(x: number, y: number, ): Projectile | null {
        return new KnifeProjectile();
    }
}