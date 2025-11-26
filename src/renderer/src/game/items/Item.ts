import { GAME_CONFIG } from '../constants';
import { Player } from '../entities/living';

export abstract class Item {
  name: string;
  description: string;
  texture: string;
  protected textures: readonly string[];
  level: number;

  constructor(
    name: string,
    description: string,
    texture: string | readonly string[]
  ) {
    this.name = name;
    this.description = description;
    const normalizedTextures = Array.isArray(texture)
      ? texture.slice()
      : [texture];

    if (normalizedTextures.length === 0) {
      throw new Error('Item textures cannot be empty');
    }

    this.textures = normalizedTextures;
    this.texture = this.textures[0];
    this.level = 0;
  }

  get isMaxLevel() {
    return this.level >= GAME_CONFIG.MAX_ITEM_LEVEL;
  }

  getTextureForLevel(level: number): string {
    const clampedLevel = Math.max(level, 0);
    const index = Math.min(clampedLevel, this.textures.length - 1);
    return this.textures[index];
  }

  protected refreshTexture(): void {
    const nextTexture = this.getTextureForLevel(this.level);
    if (this.texture !== nextTexture) {
      this.texture = nextTexture;
      this.onTextureChanged(nextTexture);
    }
  }

  protected onTextureChanged(_texture: string): void {}

  abstract applyEffect(player: Player): void;
  abstract removeEffect?(player: Player): void;

  levelUp(player: Player) {
    if (!this.isMaxLevel) {
      this.level++;
      this.refreshTexture();
      this.onLevelUp(player);
    }
  }

  protected onLevelUp(_player: Player): void {}

  update(_player: Player, _time: number, _delta: number): void {}
}
