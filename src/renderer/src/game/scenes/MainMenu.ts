import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import { TextButton } from '../ui/components/TextButton';

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  start: TextButton;

  constructor() {
    super('MainMenu');
  }

  create() {
    this.title = this.add
      .text(this.scale.width / 2, this.scale.height / 2, 'Main Menu', {
        fontFamily: 'Arial Black',
        fontSize: 38,
        color: '#ffffff',
        align: 'center'
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.start = new TextButton(
      this,
      this.scale.width / 2,
      this.scale.height / 2 + 80,
      'Start',
      {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#ffffff',
        align: 'center'
      },
      {
        hoverColor: '#e6e6e6',
        onClick: () => this.changeScene()
      }
    );

    EventBus.emit('current-scene-ready', this);
  }

  changeScene() {
    this.scene.start('Game');
  }
}
