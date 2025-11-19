import { Entity } from '../entities/Entity';
import { Player } from '../entities/living/Player';
import { Game } from '../scenes/Game';

export class HealingChocolate extends Entity {
  private lifetime = 8000;
  private elapsed = 0;
  private healAmount = 30;
  private pickupRadius = 32;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'healing_chocolate');
    this.sprite.setScale(0.8);
  }

  update(_time: number, delta: number) {
    this.elapsed += delta;

    if (this.elapsed >= this.lifetime) {
      this.destroy();
      return;
    }

    const game = this.scene as Game;
    const player: Player = game.player;
    const dx = this.x - player.x;
    const dy = this.y - player.y;

    if (dx * dx + dy * dy <= this.pickupRadius * this.pickupRadius) {
      player.healthManager.heal(this.healAmount);
      this.destroy();
    }
  }

  destroy() {
    super.destroy();
  }
}
