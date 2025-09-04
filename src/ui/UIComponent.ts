export abstract class UIComponent {
    abstract update(dt: number): void;
    abstract draw(ctx: CanvasRenderingContext2D): void;
}