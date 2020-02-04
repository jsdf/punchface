import {Vec3d} from "./Vec3d";
import {Game} from "./Game";

let idCounter = 0;

export class GameObject {
	position = new Vec3d();
	id = idCounter++;

	update(game: Game) {}

	render(game, ctx) {}
	renderDebug(game, ctx) {
		const screenPos = game.getScreenPos(this);

		ctx.font = "8px Lucida Grande";
		ctx.fillStyle = "black";
		ctx.fillText(
			`${this.toString()} ${this.position.toString()}`,
			screenPos.x,
			screenPos.y
		);
	}

	toString() {
		return `{${this.constructor.name}:${this.id}}`;
	}
}
