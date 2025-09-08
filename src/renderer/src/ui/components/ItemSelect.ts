import { UIComponent } from '../UIComponent';
import type { Weapon } from '../../entities';
import type { Game } from '../../Game';

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
  game: Game;
  canvas: HTMLCanvasElement;

  constructor(
    weaponClasses: (new (...args: any) => Weapon)[],
    game: Game,
    onSelect: (weapon: Weapon) => void
  ) {
    super();
    this.game = game;
    this.onSelect = onSelect;
    this.choices = [];
    this.canvas = game.canvas;

    const total = weaponClasses.length;
    const buttonWidth = 120;
    const buttonHeight = 50;
    const spacing = 20;
    const startX =
      (this.canvas.width - total * buttonWidth - (total - 1) * spacing) / 2;
    const y = this.canvas.height / 2 - buttonHeight / 2;

    weaponClasses.forEach((weaponClass, i) => {
      this.choices.push({
        weaponClass,
        x: startX + i * (buttonWidth + spacing),
        y,
        width: buttonWidth,
        height: buttonHeight
      });
    });

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('click', this.handleClick);
  }

  handleMouseMove(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
  }

  handleClick(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (const choice of this.choices) {
      if (
        mouseX >= choice.x &&
        mouseX <= choice.x + choice.width &&
        mouseY >= choice.y &&
        mouseY <= choice.y + choice.height
      ) {
        const weapon = new choice.weaponClass(this.game);
        this.onSelect(weapon);

        this.destroy();
        //this.game.ui.removeCanvasUI(this);
        break;
      }
    }
  }

  destroy() {
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('click', this.handleClick);
  }

  update(_dt: number): void {}

  draw(ctx: CanvasRenderingContext2D): void {
    this.choices.forEach((choice) => {
      const isHover =
        this.mouseX >= choice.x &&
        this.mouseX <= choice.x + choice.width &&
        this.mouseY >= choice.y &&
        this.mouseY <= choice.y + choice.height;

      ctx.fillStyle = isHover ? '#555' : '#333';
      ctx.fillRect(choice.x, choice.y, choice.width, choice.height);

      ctx.strokeStyle = 'white';
      ctx.strokeRect(choice.x, choice.y, choice.width, choice.height);

      ctx.fillStyle = isHover ? 'yellow' : 'white';
      ctx.font = isHover ? 'bold 16px Arial' : '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(
        new choice.weaponClass(this.game).name,
        choice.x + choice.width / 2,
        choice.y + choice.height / 2
      );
    });
  }
}
