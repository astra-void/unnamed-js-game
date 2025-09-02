import { Game } from "./game";
import "./style.css";

export const canvas = document.getElementById("game") as HTMLCanvasElement;

export const keys: Record<string, boolean> = {};

export let game: Game;

export let mouseX = 0;
export let mouseY = 0;

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

window.addEventListener('keydown', (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function main() {
  game = new Game(canvas);
}

main();