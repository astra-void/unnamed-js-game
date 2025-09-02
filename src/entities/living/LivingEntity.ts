import { Entity } from "../Entity";

export abstract class LivingEntity extends Entity {
    hp: number;
    maxHp: number;

    constructor(x: number, y: number, maxHp: number) {
        super(x, y);
        this.maxHp = maxHp;
        this.hp = maxHp;
    }


    takeDamage(amount: number) {
        this.hp = Math.max(this.hp - amount, 0);
        if (this.hp === 0) {
            this.onDeath();
        }
    }

    heal(amount: number) {
        this.hp = Math.min(this.hp + amount, this.maxHp);
    }

    protected onDeath() {}
}