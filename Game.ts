import {Player} from "./Player";
import {Background} from "./Background";
import * as utils from "./utils";
import {Input} from "./Input";
import {GameObject} from "./GameObject";
import {Physics} from "./Physics";
import {View} from "./View";
import {Vec2d} from "./Vec2d";
import {sewerAnim} from "./assets";

const PX_PER_METRE = 50;
const canvas = utils.getCanvas();
const debug = document.getElementById("debug");

export class Game {
	realFrameNumber = 0;
	frameNumber = 0;
	input = new Input();
	player = new Player();
	physics = new Physics();
	worldObjects: Array<GameObject> = [];
	view = new View();

	constructor() {
		const background = new Background(sewerAnim);
		background.position.x = -90;
		this.physics.bodies.push(this.player.physBody);
		this.worldObjects.push(this.player, background);
	}

	update() {
		const frameStartTime = performance.now();
		this.input.update();

		this.worldObjects.forEach(obj => obj.update(this));

		this.physics.step(frameStartTime);
		this.view.update(this.player.position, canvas.width, canvas.height);
	}

	render() {
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("couldn't get canvas context");

		this.realFrameNumber++;
		if (this.realFrameNumber % 4 != 0) return;
		this.frameNumber++;

		// clear
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const zSortedObjects = this.worldObjects
			.slice()
			.sort((a, b) => a.zLayer - b.zLayer);

		zSortedObjects.forEach(obj => obj.render(this, ctx));
		zSortedObjects.forEach(obj => obj.renderDebug(this, ctx));

		if (debug) {
			debug.textContent = JSON.stringify(
				{
					view: this.view.offset,
					phys: {
						pos: this.player.physBody.position,
						vel: this.player.physBody.nonIntegralVelocity,
						acc: this.player.physBody.nonIntegralAcceleration
					}
				},
				null,
				2
			);
		}
	}

	getScreenPos(obj: GameObject) {
		return this.view.getScreenPos(obj.position);
	}
}
