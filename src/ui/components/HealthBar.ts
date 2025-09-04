import { UIComponent } from "../UIComponent";
import type { Player } from "../../entities";

export class HealthBar extends UIComponent {
  player: Player;

  constructor(player: Player) {
    super();
    this.player = player;
  }

  update() {} /** empty */

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "red";
    ctx.fillRect(20, 20, 200 * (this.player.hp / this.player.maxHp), 20);
    ctx.strokeStyle = "white";
    ctx.strokeRect(20, 20, 200, 20);
  }
}
