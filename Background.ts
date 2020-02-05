import {GameObject} from "./GameObject";
import {Vec3d} from "./Vec3d";

import * as utils from "./utils";

export class Background extends GameObject {
	anim: Array<string>;
	constructor(anim) {
		super();
		this.anim = anim;
		this.zLayer = -Infinity;
	}

	update(game) {}

	render(game, ctx) {
		const bgImage = utils.getImage(
			this.anim[game.frameNumber % this.anim.length]
		);
		const screenPos = game.getScreenPos(this);
		if (bgImage) {
			ctx.drawImage(bgImage, screenPos.x, screenPos.y);
		}
	}
}
