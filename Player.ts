import {GameObject} from "./GameObject";
import {idleAnim, walkAnim} from "./assets";
import {Vec2d} from "./Vec2d";

import * as utils from "./utils";

export class Player extends GameObject {
	anim = idleAnim;
	update(game) {
		const movement = new Vec2d();
		if (game.input.keys.has("d")) {
			movement.x = 1;
		}
		if (game.input.keys.has("a")) {
			movement.x = -1;
		}
		if (game.input.keys.has("w")) {
			movement.y = -1;
		}
		if (game.input.keys.has("s")) {
			movement.y = 1;
		}

		this.position.add(movement);

		if (movement.magnitude() > 0) {
			this.anim = walkAnim;
		} else {
			this.anim = idleAnim;
		}
	}

	render(ctx, frame) {
		const guyImage = utils.getImage(this.anim[frame % this.anim.length]);
		if (guyImage) {
			ctx.drawImage(guyImage, this.position.x, this.position.y);
		}
	}
}
