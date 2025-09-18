import { UIManager } from '../ui/UIManager';

declare module 'phaser' {
  interface Scene {
    uiManager: UIManager;
  }
}
