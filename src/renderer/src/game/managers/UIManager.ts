import Phaser from 'phaser';
import { UIComponent } from '../types/ui';

export class UIManager {
  private scene: Phaser.Scene;
  private uiList = new Map<string, UIComponent>();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  add(component: UIComponent): void {
    if (this.uiList.has(component.id)) {
      this.remove(component.id);
    }
    this.uiList.set(component.id, component);

    if (!component.object.scene) {
      this.scene.add.existing(component.object);
    }
  }

  remove(id: string): void {
    const comp = this.uiList.get(id);
    if (!comp) return;
    comp.destroy();
    this.uiList.delete(id);
  }

  update(time: number, delta: number): void {
    this.uiList.forEach((comp) => comp.update?.(time, delta));
  }

  clear(): void {
    this.uiList.forEach((comp) => comp.destroy());
    this.uiList.clear();
  }
}
