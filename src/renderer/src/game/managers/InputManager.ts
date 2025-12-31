import Phaser from 'phaser';
import {
  JoystickUIBlocker,
  VirtualJoystick,
  VirtualJoystickConfig
} from '../input/VirtualJoystick';

type Vector = { x: number; y: number };

const JOYSTICK_MODE: 'fixed' | 'floating' = 'fixed';
const MOVE_SMOOTHING_ALPHA = 0.18;
const AIM_SMOOTHING_ALPHA = 0.25;

export class InputManager {
  scene: Phaser.Scene;
  isTouchDevice: boolean;

  private leftJoystick?: VirtualJoystick;
  private rightJoystick?: VirtualJoystick;
  private lastAim: Vector = { x: 1, y: 0 };
  private enabled = true;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.isTouchDevice =
      !scene.sys.game.device.os.desktop || scene.sys.game.device.input.touch;

    if (this.isTouchDevice) {
      this.ensurePointers();

      const uiBlocker: JoystickUIBlocker = (currentlyOver, joystickObjects) => {
        return currentlyOver.some(
          (obj) => obj.input?.enabled === true && !joystickObjects.has(obj)
        );
      };

      const createConfig = (
        side: 'left' | 'right',
        smoothingAlpha: number
      ): VirtualJoystickConfig => ({
        side,
        mode: JOYSTICK_MODE,
        smoothingAlpha,
        deadzone: 0.15,
        marginX: 32,
        marginY: 44,
        uiBlocker
      });

      this.leftJoystick = new VirtualJoystick(
        scene,
        createConfig('left', MOVE_SMOOTHING_ALPHA)
      );
      this.rightJoystick = new VirtualJoystick(
        scene,
        createConfig('right', AIM_SMOOTHING_ALPHA)
      );
    }
  }

  update(_time?: number, _delta?: number): void {
    if (!this.isTouchDevice || !this.enabled) {
      return;
    }

    const aim = this.rightJoystick?.getValue() ?? { x: 0, y: 0 };
    if (aim.x !== 0 || aim.y !== 0) {
      const len = Math.hypot(aim.x, aim.y) || 1;
      this.lastAim = { x: aim.x / len, y: aim.y / len };
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!this.isTouchDevice) return;

    this.leftJoystick?.setEnabled(enabled);
    this.rightJoystick?.setEnabled(enabled);
  }

  setVisible(visible: boolean) {
    if (!this.isTouchDevice) return;
    this.leftJoystick?.setVisible(visible);
    this.rightJoystick?.setVisible(visible);
  }

  reset(options?: { keepLastAim?: boolean }) {
    if (!this.isTouchDevice) return;
    this.leftJoystick?.reset();
    this.rightJoystick?.reset();

    if (!options?.keepLastAim) {
      this.lastAim = { x: 1, y: 0 };
    }
  }

  destroy() {
    this.leftJoystick?.destroy();
    this.rightJoystick?.destroy();
  }

  getMoveVector(
    keys: Record<string, Phaser.Input.Keyboard.Key>,
    cursors: Phaser.Types.Input.Keyboard.CursorKeys
  ): Vector {
    if (!this.isTouchDevice && keys && cursors) {
      let x = 0;
      let y = 0;

      if (keys.w.isDown || cursors.up.isDown) y -= 1;
      if (keys.s.isDown || cursors.down.isDown) y += 1;
      if (keys.a.isDown || cursors.left.isDown) x -= 1;
      if (keys.d.isDown || cursors.right.isDown) x += 1;

      const len = Math.hypot(x, y) || 1;
      return len > 1 ? { x: x / len, y: y / len } : { x, y };
    }

    if (this.isTouchDevice && this.enabled && this.leftJoystick) {
      const value = this.leftJoystick.getValue();
      const len = Math.hypot(value.x, value.y) || 1;
      return len > 1 ? { x: value.x / len, y: value.y / len } : value;
    }

    return { x: 0, y: 0 };
  }

  getAimVector(playerX: number, playerY: number): Vector {
    if (!this.isTouchDevice) {
      const pointer = this.scene.input.activePointer;
      const dx = pointer.worldX - playerX;
      const dy = pointer.worldY - playerY;
      const len = Math.hypot(dx, dy) || 1;
      return { x: dx / len, y: dy / len };
    }

    if (this.enabled && this.rightJoystick) {
      const value = this.rightJoystick.getValue();
      const len = Math.hypot(value.x, value.y);

      if (len > 0.12) {
        this.lastAim = { x: value.x / len, y: value.y / len };
      }
    }

    return { ...this.lastAim };
  }

  getAimWorldPoint(playerX: number, playerY: number, distance: number = 140) {
    if (!this.isTouchDevice) {
      const pointer = this.scene.input.activePointer;
      return { x: pointer.worldX, y: pointer.worldY };
    }

    const aim = this.getAimVector(playerX, playerY);
    return {
      x: playerX + aim.x * distance,
      y: playerY + aim.y * distance
    };
  }

  private ensurePointers() {
    const input = this.scene.input;
    const manager = input.manager;
    const required = 3;
    const current = manager.pointers.length;
    if (current < required) {
      const toAdd = required - current;
      input.addPointer(toAdd);
    }
  }
}
