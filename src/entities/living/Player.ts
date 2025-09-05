import type { Game } from "../../Game";
import type { Weapon } from "../item";
import { LivingEntity } from "./LivingEntity";

/**
 * Player 클래스
 * 플레이어 캐릭터 나타내는 클래스임
 */
export class Player extends LivingEntity {
    radius: number;
    speed: number;
    exp: number;
    level: number;
    weapons: Weapon[];
    fireCooldown: number;
    game: Game;

    /**
     * 
     * @param x 
     * @param y 
     * @param maxHp 
     * @param radius 
     * @param speed 
     * @param exp 
     * @param level 
     * @param weapons 
     * @param game 
     * @constructor
     */
    constructor(x: number, y: number, maxHp: number, radius = 16, speed = 200, exp = 0, level = 1, weapons: Weapon[], game: Game) {
        super(x, y, maxHp);
        this.radius = radius;
        this.speed = speed;
        this.exp = exp;
        this.level = level;
        this.weapons = weapons;
        this.game = game;
        this.fireCooldown = 0;
    }

    /**
     * 상태 업데이트
     * @param dt - 프레임 간 시간(초)
     */
    update(dt: number): void {
        if (this.game.keys["ArrowUp"] || this.game.keys["w"]) this.y -= this.speed * dt;
        if (this.game.keys["ArrowDown"] || this.game.keys["s"]) this.y += this.speed * dt;
        if (this.game.keys["ArrowLeft"] || this.game.keys["a"]) this.x -= this.speed * dt;
        if (this.game.keys["ArrowRight"] || this.game.keys["d"]) this.x += this.speed * dt;
        
        const radius = this.radius;
        const canvas = this.game.canvas;

        if (this.x < radius) this.x = radius;
        if (this.x > canvas.width - radius) this.x = canvas.width - radius;
        if (this.y < radius) this.y = radius;
        if (this.y > canvas.height - radius) this.y = canvas.height - radius;


        for (const weapon of this.weapons) {
            weapon.currentCooldown -= dt;

            if (weapon.currentCooldown <= 0) {
                weapon.currentCooldown += weapon.cooldown;
                
                weapon.attack(this.x, this.y);
            }
        }
    }

    gainExp(amount: number) {
        this.exp += amount;
        if (this.exp >= this.level * 10) {
            this.exp = 0;
            this.level++;
            console.log(`level up current level: ${this.level}`); // PLACEHOLDER: TEMP
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}