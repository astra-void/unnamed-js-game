import Phaser from 'phaser';

type JoystickSide = 'left' | 'right';
type JoystickMode = 'fixed' | 'floating';

type Vector = { x: number; y: number };

export type JoystickUIBlocker = (
  currentlyOver: Phaser.GameObjects.GameObject[],
  joystickObjects: Set<Phaser.GameObjects.GameObject>
) => boolean;

export type VirtualJoystickConfig = {
  side: JoystickSide;
  mode: JoystickMode;
  depth?: number;
  deadzone?: number;
  smoothingAlpha?: number;
  marginX?: number;
  marginY?: number;
  minRadius?: number;
  maxRadius?: number;
  uiBlocker?: JoystickUIBlocker;
};

export class VirtualJoystick {
  private scene: Phaser.Scene;
  private side: JoystickSide;
  private mode: JoystickMode;
  private depth: number;
  private deadzone: number;
  private smoothingAlpha: number;
  private marginX: number;
  private marginY: number;
  private minRadius: number;
  private maxRadius: number;
  private uiBlocker?: JoystickUIBlocker;

  private base: Phaser.GameObjects.Graphics;
  private thumb: Phaser.GameObjects.Graphics;
  private joystickObjects: Set<Phaser.GameObjects.GameObject>;

  private pointerId: number | null = null;
  private radius: number = 70;
  private thumbRadius: number = 40;
  private defaultBase: Vector = { x: 0, y: 0 };
  private smoothedValue: Vector = { x: 0, y: 0 };
  private rawValue: Vector = { x: 0, y: 0 };

  private enabled = true;
  private visible = true;

  private resizeHandler = (gameSize: Phaser.Structs.Size) =>
    this.onResize(gameSize.width, gameSize.height);

  constructor(scene: Phaser.Scene, config: VirtualJoystickConfig) {
    this.scene = scene;
    this.side = config.side;
    this.mode = config.mode;
    this.depth = config.depth ?? 1000;
    this.deadzone = config.deadzone ?? 0.15;
    this.smoothingAlpha = config.smoothingAlpha ?? 0.2;
    this.marginX = config.marginX ?? 32;
    this.marginY = config.marginY ?? 40;
    this.minRadius = config.minRadius ?? 60;
    this.maxRadius = config.maxRadius ?? 110;
    this.uiBlocker = config.uiBlocker;

    this.base = this.scene.add.graphics();
    this.thumb = this.scene.add.graphics();
    this.joystickObjects = new Set([this.base, this.thumb]);

    this.base.setScrollFactor(0).setDepth(this.depth);
    this.thumb.setScrollFactor(0).setDepth(this.depth + 1);

    this.drawGraphics();
    this.positionDefault(this.scene.scale.width, this.scene.scale.height);

    this.scene.input.on('pointerdown', this.handlePointerDown);
    this.scene.input.on('pointermove', this.handlePointerMove);
    this.scene.input.on('pointerup', this.handlePointerUp);
    this.scene.input.on('pointerupoutside', this.handlePointerUp);
    this.scene.scale.on('resize', this.resizeHandler);
  }

  getValue(): Vector {
    if (!this.enabled) return { x: 0, y: 0 };
    return { ...this.smoothedValue };
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.releasePointer();
      this.resetValue();
    }
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    this.base.setVisible(visible);
    this.thumb.setVisible(visible);
  }

  reset() {
    this.releasePointer();
    this.resetValue();
    this.recenterThumb();
  }

  destroy() {
    this.scene.input.off('pointerdown', this.handlePointerDown);
    this.scene.input.off('pointermove', this.handlePointerMove);
    this.scene.input.off('pointerup', this.handlePointerUp);
    this.scene.input.off('pointerupoutside', this.handlePointerUp);
    this.scene.scale.off('resize', this.resizeHandler);

    this.base.destroy();
    this.thumb.destroy();
  }

  private handlePointerDown = (
    pointer: Phaser.Input.Pointer,
    currentlyOver: Phaser.GameObjects.GameObject[]
  ) => {
    if (!this.enabled) return;
    if (this.pointerId !== null) return;
    if (this.uiBlocker?.(currentlyOver, this.joystickObjects)) return;
    if (!this.isWithinZone(pointer)) return;

    this.capture(pointer);
    this.updateValue(pointer);
  };

  private handlePointerMove = (pointer: Phaser.Input.Pointer) => {
    if (pointer.id !== this.pointerId) return;
    this.updateValue(pointer);
  };

  private handlePointerUp = (pointer: Phaser.Input.Pointer) => {
    if (pointer.id !== this.pointerId) return;
    this.releasePointer();
    this.resetValue();
    this.recenterThumb();
  };

  private capture(pointer: Phaser.Input.Pointer) {
    this.pointerId = pointer.id;

    if (this.mode === 'floating') {
      const clamped = this.clampToHalf(pointer.x, pointer.y);
      this.base.setPosition(clamped.x, clamped.y);
      this.thumb.setPosition(clamped.x, clamped.y);
    }
  }

  private releasePointer() {
    this.pointerId = null;
    if (this.mode === 'floating') {
      this.base.setPosition(this.defaultBase.x, this.defaultBase.y);
    }
  }

  private updateValue(pointer: Phaser.Input.Pointer) {
    const dx = pointer.x - this.base.x;
    const dy = pointer.y - this.base.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const clampedDistance = Math.min(distance, this.radius);

    const angle = Math.atan2(dy, dx);
    const offsetX = Math.cos(angle) * clampedDistance;
    const offsetY = Math.sin(angle) * clampedDistance;

    this.thumb.setPosition(this.base.x + offsetX, this.base.y + offsetY);

    const magnitude = clampedDistance / this.radius;
    let x = 0;
    let y = 0;
    if (magnitude >= this.deadzone) {
      const norm = Math.max(distance, 0.0001);
      x = (dx / norm) * magnitude;
      y = (dy / norm) * magnitude;
    }

    this.rawValue = { x, y };
    this.applySmoothing();
  }

  private applySmoothing() {
    this.smoothedValue = {
      x:
        this.smoothedValue.x * (1 - this.smoothingAlpha) +
        this.rawValue.x * this.smoothingAlpha,
      y:
        this.smoothedValue.y * (1 - this.smoothingAlpha) +
        this.rawValue.y * this.smoothingAlpha
    };
  }

  private resetValue() {
    this.rawValue = { x: 0, y: 0 };
    this.smoothedValue = { x: 0, y: 0 };
  }

  private recenterThumb() {
    this.thumb.setPosition(this.base.x, this.base.y);
  }

  private positionDefault(width: number, height: number) {
    this.radius = Phaser.Math.Clamp(
      Math.min(width, height) * 0.12,
      this.minRadius,
      this.maxRadius
    );
    this.thumbRadius = Math.floor(this.radius * 0.55);
    this.drawGraphics();

    const x =
      this.side === 'left'
        ? this.radius + this.marginX
        : width - this.radius - this.marginX;
    const y = height - this.radius - this.marginY;

    this.defaultBase = { x, y };
    if (this.pointerId === null || this.mode === 'fixed') {
      this.base.setPosition(x, y);
      this.thumb.setPosition(x, y);
    }
  }

  private onResize(width: number, height: number) {
    this.positionDefault(width, height);
    if (this.pointerId === null) {
      this.resetValue();
    }
  }

  private isWithinZone(pointer: Phaser.Input.Pointer) {
    const halfWidth = this.scene.scale.width / 2;
    const inHalf =
      this.side === 'left' ? pointer.x <= halfWidth : pointer.x >= halfWidth;

    if (this.mode === 'floating') {
      return inHalf;
    }

    const dx = pointer.x - this.base.x;
    const dy = pointer.y - this.base.y;
    const inCircle = dx * dx + dy * dy <= this.radius * this.radius * 1.2;
    return inHalf || inCircle;
  }

  private clampToHalf(x: number, y: number): Vector {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    const halfWidth = width / 2;

    const minX = this.radius + this.marginX;
    const maxX = width - this.radius - this.marginX;
    const minY = this.radius + this.marginY;
    const maxY = height - this.radius - this.marginY;

    const clampedX =
      this.side === 'left'
        ? Phaser.Math.Clamp(x, minX, halfWidth - this.marginX * 0.5)
        : Phaser.Math.Clamp(x, halfWidth + this.marginX * 0.5, maxX);
    const clampedY = Phaser.Math.Clamp(y, minY, maxY);

    return { x: clampedX, y: clampedY };
  }

  private drawGraphics() {
    this.base.clear();
    this.thumb.clear();

    this.base.setDepth(this.depth);
    this.thumb.setDepth(this.depth + 1);

    this.base.fillStyle(0xffffff, 0.15);
    this.base.fillCircle(0, 0, this.radius);
    this.base.lineStyle(3, 0xffffff, 0.35);
    this.base.strokeCircle(0, 0, this.radius);

    this.thumb.fillStyle(0xffffff, 0.6);
    this.thumb.fillCircle(0, 0, this.thumbRadius);
    this.thumb.lineStyle(2, 0x000000, 0.6);
    this.thumb.strokeCircle(0, 0, this.thumbRadius);
  }
}
