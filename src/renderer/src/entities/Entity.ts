export abstract class Entity {
  x: number;
  y: number;

  /**
   *
   * @param x
   * @param y
   * @constructor
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  abstract update(dt: number): void;
  abstract draw(ctx: CanvasRenderingContext2D): void;
}
