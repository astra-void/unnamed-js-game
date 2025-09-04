import { UIComponent, DOMUIComponent } from "./";

export class UIManager {
    canvasComponents: UIComponent[] = [];
    domComponents: DOMUIComponent[] = [];

    addCanvasUI(c: UIComponent) {
        this.canvasComponents.push(c);
    }

    addDOMUI(c: DOMUIComponent) {
        this.domComponents.push(c);
    }

    update(dt: number) {
        this.canvasComponents.forEach(c => c.update(dt));
        this.domComponents.forEach(c => c.update(dt));
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.canvasComponents.forEach(c => c.draw(ctx));
    }
}
