import {Player} from "./Player";
import * as utils from "./utils";
import {Input} from "./Input";

const canvas = utils.getCanvas();
export class Game {
	realFrameNumber = 0;
	frameNumber = 0;
	input = new Input();
	player = new Player();
	worldObjects = [this.player];

	update() {
		this.worldObjects.forEach(obj => obj.update(this));
	}

	render() {
		const ctx = canvas.getContext("2d");

		this.realFrameNumber++;
		if (this.realFrameNumber % 2 != 0) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.frameNumber++;

		this.player.render(ctx, this.frameNumber);
	}
}
