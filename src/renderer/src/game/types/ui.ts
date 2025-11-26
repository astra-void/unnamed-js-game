export interface UIComponent {
  id: string;
  object: Phaser.GameObjects.GameObject;
  update?(time: number, delta: number): void;
  destroy(): void;
}
