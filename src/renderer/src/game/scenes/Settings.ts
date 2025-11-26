import { Scene } from 'phaser';

export class Settings extends Scene {
  constructor() {
    super('Settings');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add
      .text(width / 2, height / 2, 'nothing here go back', {
        fontFamily: 'Arial',
        fontSize: '48px',
        color: '#ffffff'
      })
      .setOrigin(0.5);
  }
}
