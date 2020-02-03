import {Game} from "./Game";
const game = new Game();
window.game = game;

document.addEventListener("keydown", e => game.input.onKeyDown(e.key));
document.addEventListener("keyup", e => game.input.onKeyUp(e.key));

function animationLoop() {
	requestAnimationFrame(() => {
		game.update();
		game.render();

		animationLoop();
	});
}
animationLoop();
