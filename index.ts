import {Game} from "./Game";

import {images} from "./assets";
import * as utils from "./utils";

Object.entries(images).forEach(([name, url]) => utils.getImage(url));

const game = new Game();
window.game = game;

document.addEventListener("keydown", e => {
	if (!e.repeat) {
		game.input.onKeyDown(e.key);
	}
});
document.addEventListener("keyup", e => {
	game.input.onKeyUp(e.key);
});

function animationLoop() {
	requestAnimationFrame(() => {
		game.update();
		game.render();

		animationLoop();
	});
}
animationLoop();
