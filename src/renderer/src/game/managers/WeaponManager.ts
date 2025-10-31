import { GAME_CONFIG } from '../constants';
import { Player } from '../entities/living';
import { Weapon } from '../weapons';

export class WeaponManager {
  player: Player;
  scene: Phaser.Scene;
  weapons = new Map<string, Weapon>();

  constructor(player: Player, scene: Phaser.Scene) {
    this.player = player;
    this.scene = scene;

    const defaultWeapon = new GAME_CONFIG.DEFAULT_WEAPON(
      this.scene,
      this.player
    );
    defaultWeapon.levelUp();
    this.add(defaultWeapon);
  }

  add(weapon: Weapon): void {
    this.weapons.set(weapon.name, weapon);
  }

  remove(weapon: Weapon): void {
    this.weapons.delete(weapon.name);
  }

  find(name: string): Weapon | undefined {
    return this.weapons.get(name);
  }

  attack(dt: number) {
    for (const weapon of this.weapons.values()) {
      weapon.currentCooldown -= dt;

      if (weapon.currentCooldown <= 0) {
        weapon.currentCooldown += weapon.cooldown;

        weapon.attack();
      }
    }
  }

  clear() {
    this.weapons.forEach((w) => w.destroy());
    this.weapons.clear();
  }
}
