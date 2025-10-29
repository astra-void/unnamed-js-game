import { GAME_CONFIG } from '../constants';
import { EventBus } from '../EventBus';
import { Player } from '../entities/living';
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

  get nextLevelExp() {
    return this.level * GAME_CONFIG.EXP_MULTIPLIER;
  }

  gainExp(amount: number) {
    this.exp += amount;
    EventBus.emit(`player:${this.player.id}:expChanged`, { exp: this.exp, maxExp: this.nextLevelExp });

    while (this.exp >= this.nextLevelExp) {
      this.exp -= this.nextLevelExp;
      this.level++;
      EventBus.emit('enemyManager:waveUp');
      EventBus.emit(`player:${this.player.id}:levelUp`, this.level);
    }
  }
}
