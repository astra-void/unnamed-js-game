import Phaser from "phaser";
import type { Player } from "../../entities/living";

export abstract class Item {
  scene: Phaser.Scene;
  player: Player;
  level: number;

  constructor(scene: Phaser.Scene, player: Player) {
    this.scene = scene;
    this.player = player;
    this.level = 1;
  }

  abstract applyEffect(): void;

  abstract gainExp(amount: number): void;
}
