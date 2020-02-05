import {GameObject} from "./GameObject";
import {idleAnim, walkAnim} from "./assets";
import {Vec3d} from "./Vec3d";
import {PhysBody} from "./Physics";

import * as utils from "./utils";

const MOVEMENT_SPEED = 1;

export class Player extends GameObject {
	anim = idleAnim;
	physBody = new PhysBody({obj: this, mass: 200, radius: 50});
	constructor() {
		super();
		this.position.y = -600;
		this.bounds.fromCenteredBox(
			new Vec3d({
				x: 118,
				y: 116,
				z: 50
			})
		);
	}

	isOnGround(game) {
		return (
			this.physBody.position.y - this.physBody.radius <=
			game.physics.floorHeight + 0.001
		);
	}

	update(game) {
		const movement = game.input.direction.clone();
		movement.mulScalar(MOVEMENT_SPEED);
		const onGround = this.isOnGround(game);
		if (!onGround) {
			movement.z = 0;
		}
		this.position.add(movement);

		if (game.input.jump) {
			if (onGround) {
				this.physBody.applyForce(
					new Vec3d({x: 0, y: 10000, z: 0}).mulScalar(
						this.physBody.mass
					)
				);
			}
		}

		if (game.input.direction.magnitude() > 0 && onGround) {
			this.anim = walkAnim;
		} else {
			this.anim = idleAnim;
		}
	}

	render(game, ctx) {
		const guyImage = utils.getImage(
			this.anim[game.frameNumber % this.anim.length]
		);
		const screenPos = game.getScreenPos(this);
		if (guyImage) {
			ctx.drawImage(
				guyImage,

				screenPos.x - guyImage.width / 2,
				screenPos.y - guyImage.height / 2
			);
		}
	}
}
