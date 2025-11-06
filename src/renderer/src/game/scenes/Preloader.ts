import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, 'background');

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    // Load weapons image
    this.load.setPath('assets');

    this.load.image('arrow', 'arrow.png');
    this.load.image('gummy_soul', 'gummy_soul.png');
    this.load.image('gummy_staff', 'gummy_staff.png');
    this.load.image('jelly_bombard', 'jelly_bombard.png');
    this.load.image('jelly_crossbow', 'jelly_crossbow.png');
    this.load.image('jelly_flame', 'jelly_flame.png');
    this.load.image('milk_sprayer', 'milk_sprayer.png');
    this.load.image('morning_star', 'morning_star.png');
    this.load.image('scythe', 'scythe.png');

    // Load projectiles image
    this.load.setPath('assets/projectiles');

    this.load.image('arrow_projectiles', 'arrow.png');
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start('MainMenu');
  }
}
