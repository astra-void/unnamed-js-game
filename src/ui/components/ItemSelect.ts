/* eslint-disable @typescript-eslint/no-explicit-any */
import { UIComponent } from "../UIComponent";
import type { Weapon } from "../../entities";

interface Choice {
    weaponClass: new (...args: any) => Weapon;
    x: number;
    y: number;
    width: number;
    height: number;
}

export class ItemSelect extends UIComponent {
    choices: Choice[];
    onSelect: (weapon: Weapon) => void;
    mouseX: number = 0;
    mouseY: number = 0;

    constructor(
        weaponClasses: (new (...args: any) => Weapon)[],
        canvas: HTMLCanvasElement,
        onSelect: (weapon: Weapon) => void
    ) {
        super();
        this.onSelect = onSelect;
        this.choices = [];

        const total = weaponClasses.length;
        const buttonWidth = 120;
        const buttonHeight = 50;
        const spacing = 20;
        const startX = (canvas.width - total * buttonWidth - (total - 1) * spacing) / 2;
        const y = canvas.height / 2 - buttonHeight / 2;

        weaponClasses.forEach((weaponClass, i) => {
            this.choices.push({
                weaponClass,
                x: startX + i * (buttonWidth + spacing),
                y,
                width: buttonWidth,
                height: buttonHeight,
            });
        });

        canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e, canvas));
        canvas.addEventListener("click", (e) => this.handleClick(e, canvas));
    }

    handleMouseMove(e: MouseEvent, canvas: HTMLCanvasElement) {
        const rect = canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;
    }

    handleClick(e: MouseEvent, canvas: HTMLCanvasElement) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        for (const choice of this.choices) {
            if (
                mouseX >= choice.x &&
                mouseX <= choice.x + choice.width &&
                mouseY >= choice.y &&
                mouseY <= choice.y + choice.height
            ) {
                const weapon = new choice.weaponClass();
                this.onSelect(weapon);
                break;
            }
        }
    }

    update(_dt: number): void {
        
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.choices.forEach(choice => {
            const isHover =
                this.mouseX >= choice.x &&
                this.mouseX <= choice.x + choice.width &&
                this.mouseY >= choice.y &&
                this.mouseY <= choice.y + choice.height;

            ctx.fillStyle = isHover ? "#555" : "#333";
            ctx.fillRect(choice.x, choice.y, choice.width, choice.height);

            ctx.strokeStyle = "white";
            ctx.strokeRect(choice.x, choice.y, choice.width, choice.height);

            ctx.fillStyle = "white";
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(new choice.weaponClass().name, choice.x + choice.width / 2, choice.y + choice.height / 2);
        });
    }
}
