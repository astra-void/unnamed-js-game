import { Player } from '../entities/living';
import { Weapon } from '../weapons';

export class WeaponManager {
  player: Player;
  scene: Phaser.Scene;
  weapons: Weapon[] = [];

  constructor(player: Player, scene: Phaser.Scene) {
    this.player = player;
    this.scene = scene;
  }

  addWeapon(weapon: Weapon) {
    this.weapons.push(weapon);
  }

  removeWeapon(weapon: Weapon) {
    this.weapons = this.weapons.filter((w) => w !== weapon);
  }

  findWeapon(name: string) {
    return this.weapons.find((w) => w.name === name);
  }

  attack(dt: number) {
    for (const weapon of this.weapons) {
      weapon.currentCooldown -= dt;

      if (weapon.currentCooldown <= 0) {
        weapon.currentCooldown += weapon.cooldown;

        weapon.attack();
      }
    }
  }

  clear() {
    this.weapons.forEach((w) => w.destroy());
    this.weapons = [];
  }
}
