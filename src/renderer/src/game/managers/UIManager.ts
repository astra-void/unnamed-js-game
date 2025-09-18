export interface UIComponent {
  id: string;
  object: Phaser.GameObjects.GameObject;
  update?: (time: number, delta: number) => void;
}

export class UIManager {
  private scene: Phaser.Scene;
  private uiList: Map<string, UIComponent> = new Map();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  addUI(component: UIComponent): void {
    if (this.uiList.has(component.id)) return;
    this.uiList.set(component.id, component);
    this.scene.add.existing(component.object);
  }

  removeUI(id: string): void {
    const comp = this.uiList.get(id);
    if (!comp) return;
    comp.object.destroy();
    this.uiList.delete(id);
  }

  update(time: number, delta: number): void {
    this.uiList.forEach((comp) => {
      comp.update?.(time, delta);
    });
  }

  clear(): void {
    this.uiList.forEach((comp) => {
      comp.object.destroy();
    });
    this.uiList.clear();
  }
}
