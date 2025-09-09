import { UIComponent } from './UIComponent';

export class UIManager {
  canvasComponents: UIComponent[] = [];

  addCanvasUI(c: UIComponent) {
    this.canvasComponents.push(c);
  }

  removeCanvasUI(c: UIComponent) {
    const index = this.canvasComponents.indexOf(c);
    if (index !== -1) this.canvasComponents.splice(index, 1);
  }

  update(dt: number) {
    this.canvasComponents.forEach((c) => c.update(dt));
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.canvasComponents.forEach((c) => c.draw(ctx));
  }
}
