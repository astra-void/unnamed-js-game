import { AUTO, Game } from 'phaser';
import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: import.meta.env.VITE_WIDTH,
  height: import.meta.env.VITE_HEIGHT,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: true // DEBUG
    }
  },
  parent: 'game-container',
  backgroundColor: '#000000',
  scene: [Boot, Preloader, MainMenu, MainGame, GameOver]
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
