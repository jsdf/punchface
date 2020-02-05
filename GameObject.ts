import {Vec3d} from "./Vec3d";
import {Bounds3d} from "./Bounds";
import {Game} from "./Game";

let idCounter = 0;

export class GameObject {
	position = new Vec3d();
	bounds = new Bounds3d(new Vec3d(), new Vec3d());
	id = idCounter++;
	zLayer = 0;

	update(game: Game) {}

	render(game, ctx) {}
	renderDebug(game, ctx) {
		const screenPos = game.getScreenPos(this);

		ctx.font = "8px Lucida Grande";
		ctx.fillStyle = "red";
		ctx.fillText(
			`${this.toString()} ${this.position.toString()}`,
			screenPos.x,
			screenPos.y
		);

		const minFlat = this.bounds.min.clone();
		minFlat.z = 0;
		const maxFlat = this.bounds.max.clone();
		maxFlat.z = 0;

		const min = game.view.getScreenPos(this.position.clone().add(minFlat));
		const maxOffset = game.view
			.getScreenPos(this.position.clone().add(maxFlat))
			.sub(min);
		ctx.strokeRect(min.x, min.y, maxOffset.x, maxOffset.y);
	}

	toString() {
		return `{${this.constructor.name}:${this.id}}`;
	}
}
