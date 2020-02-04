import {Vec3d} from "./Vec3d";

export class Input {
	keysDown = new Set();
	// keys newly pressed this frame
	keysTriggered = new Set();
	direction = new Vec3d();
	jump = false;

	onKeyDown(key) {
		console.log("onKeyDown", key);
		this.keysDown.add(key);
		this.keysTriggered.add(key);
	}

	onKeyUp(key) {
		this.keysDown.delete(key);
		this.keysTriggered.delete(key);
	}

	update() {
		this.direction.origin();
		this.jump = false;

		if (this.keysDown.has("d")) {
			this.direction.x += 1;
		}
		if (this.keysDown.has("a")) {
			this.direction.x += -1;
		}
		if (this.keysDown.has("w")) {
			this.direction.z += 1;
		}
		if (this.keysDown.has("s")) {
			this.direction.z += -1;
		}

		if (this.keysTriggered.has("c")) {
			this.jump = true;
		}

		// console.log(this.keysTriggered);

		this.keysTriggered.clear();
	}
}
