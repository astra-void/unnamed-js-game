import type { Game } from "../../Game";
import { TestProjectile } from "../projectiles/TestProjectile";
import { Weapon } from "./Weapon";

export class Test2 extends Weapon {
    constructor(game: Game) {
        super("Test2", game, 1, 0, 20, 40, 5);
    }

    use?(): void {} /* empty */

    attack(x: number, y: number): void {
        if (!this.speed || !this.lifetime) return;

        const dx = this.game.mouseX - this.game.player.x;
        const dy = this.game.mouseY - this.game.player.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const speed = 200;
        const vx = (dx / len) * speed;
        const vy = (dy / len) * speed;

        this.game.projectiles.push(new TestProjectile(x, y, vx, vy, this.damage, this.speed, this.lifetime))
    }
}