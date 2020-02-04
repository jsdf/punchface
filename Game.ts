import {Player} from "./Player";
import * as utils from "./utils";
import {Input} from "./Input";
import {GameObject} from "./GameObject";
import {Physics} from "./Physics";

const PX_PER_METRE = 50;
const canvas = utils.getCanvas();
export class Game {
	realFrameNumber = 0;
	frameNumber = 0;
	input = new Input();
	player = new Player();
	physics = new Physics();
	worldObjects = [this.player];

	constructor() {
		this.physics.bodies.push(this.player.physBody);
	}

	update() {
		const frameStartTime = performance.now();
		this.input.update();

		this.worldObjects.forEach(obj => obj.update(this));

		this.physics.step(frameStartTime);
		// console.log(
		// 	"after",
		// 	this.physics.bodies.map((v, i) => [i, v.position.clone()])
		// );
	}

	render() {
		const ctx = canvas.getContext("2d");

		this.realFrameNumber++;
		if (this.realFrameNumber % 4 != 0) return;

		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		this.frameNumber++;

		this.worldObjects.forEach(obj => obj.render(this, ctx));

		debug.textContent = JSON.stringify(
			{
				pos: this.player.physBody.position,
				vel: this.player.physBody.nonIntegralVelocity,
				acc: this.player.physBody.nonIntegralAcceleration
			},
			null,
			2
		);
	}

	getScreenPos(obj: GameObject) {
		return {
			x: Math.floor(obj.position.x),
			y: -Math.floor(obj.position.y + obj.position.z / 2)
		};
	}
}
