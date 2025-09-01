export interface Entity {
  x: number;
  y: number;
  radius: number;
  update(dt: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
};

