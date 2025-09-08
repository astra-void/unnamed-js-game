import { UIComponent, DOMUIComponent } from '.';

export class UIManager {
  canvasComponents: UIComponent[] = [];
  domComponents: DOMUIComponent[] = [];

  addCanvasUI(c: UIComponent) {
    this.canvasComponents.push(c);
  }

  removeCanvasUI(c: UIComponent) {
    const index = this.canvasComponents.indexOf(c);
    if (index !== -1) this.canvasComponents.splice(index, 1);
  }

  addDOMUI(c: DOMUIComponent) {
    this.domComponents.push(c);
  }

  removeDOMUI(c: DOMUIComponent) {
    const index = this.domComponents.indexOf(c);
    if (index !== -1) this.canvasComponents.splice(index, 1);
  }

  update(dt: number) {
    this.canvasComponents.forEach((c) => c.update(dt));
    this.domComponents.forEach((c) => c.update(dt));
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.canvasComponents.forEach((c) => c.draw(ctx));
  }
}
