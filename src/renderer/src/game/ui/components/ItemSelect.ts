import { Scene } from 'phaser';
import { TextButton } from './TextButton';
import { Weapon } from '../../weapons';
import { Player } from '../../entities/living';

export type WeaponConstructor = new (
  scene: Phaser.Scene,
  player: Player
) => Weapon;

interface Choice {
  weaponClass: WeaponConstructor;
  name: string;
  button: TextButton;
}

export class ItemSelect {
  scene: Scene;
  player: Player;
  onSelect: (weapon: Weapon) => void;
  choices: Choice[] = [];

  constructor(
    scene: Scene,
    player: Player,
    weaponClasses: WeaponConstructor[],
    onSelect: (weapon: Weapon) => void
  ) {
    this.scene = scene;
    this.player = player;
    this.onSelect = onSelect;

    const total = weaponClasses.length;
    const buttonWidth = 120;
    const buttonHeight = 50;
    const spacing = 20;
    const startX =
      (scene.scale.width - total * buttonWidth - (total - 1) * spacing) / 2;
    const y = scene.scale.height / 2 - buttonHeight / 2;

    weaponClasses.forEach((WeaponClass, i) => {
      const tempWeapon = new WeaponClass(scene, player);

      const btn = new TextButton(
        scene,
        startX + i * (buttonWidth + spacing),
        y,
        tempWeapon.name,
        {
          fontSize: '16px',
          fontStyle: 'bold'
        },
        {
          textColor: 'white',
          hoverColor: 'yellow',
          onClick: () => {
            const weapon = new WeaponClass(scene, player);
            this.onSelect(weapon);
            this.destroy();
          }
        }
      );

      btn.setOrigin(0, 0.5);

      this.choices.push({
        weaponClass: WeaponClass,
        name: tempWeapon.name,
        button: btn
      });
    });
  }

  destroy() {
    this.choices.forEach((choice) => choice.button.destroy());
    this.choices = [];
  }
}
