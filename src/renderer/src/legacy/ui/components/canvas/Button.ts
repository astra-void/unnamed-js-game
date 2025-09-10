import { UIComponent } from '../../UIComponent';

export class Button extends UIComponent {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  onClick: () => void;
  hover: boolean = false;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    onClick: () => void,
    canvas: HTMLCanvasElement
  ) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.onClick = onClick;

    canvas.addEventListener('click', (e) => this.handleClick(e));
    canvas.addEventListener('mousemove', (e) => this.handleHover(e));
  }

  handleClick(e: MouseEvent) {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    ) {
      this.onClick();
    }
  }

  handleHover(e: MouseEvent) {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    this.hover =
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height;
  }

  update(_dt: number): void {} /* empty */

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.hover ? '#555' : '#333';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.strokeStyle = 'white';
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
  }
}
