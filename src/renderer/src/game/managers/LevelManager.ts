import { GAME_CONFIG } from '../constants';
import { Player } from '../entities/living';
import { EventBus } from '../EventBus';
import { Game } from '../scenes/Game';

export class LevelManager {
  player: Player;
  game: Game;
  exp = 0;
  level = 1;

  constructor(player: Player, game: Game) {
    this.player = player;
    this.game = game;
  }

  gainExp(amount: number) {
    this.exp += amount;

    const expNeeded = this.level * GAME_CONFIG.EXP_MULTIPLIER;
    while (this.exp >= expNeeded) {
      this.exp -= expNeeded;
      this.level++;
      EventBus.emit('enemyManager:waveUp');
      EventBus.emit('player:levelUp', this.level);
    }
  }
}
