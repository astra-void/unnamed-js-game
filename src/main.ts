import { Game } from "./Game";
import "./style.css";

export const canvas = document.getElementById("game") as HTMLCanvasElement;

export let game: Game;

function main() {
  game = new Game(canvas);
}

main();