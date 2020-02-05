import {Vec2d} from "./Vec2d";
import {Vec3d} from "./Vec3d";

export class Bounds3d {
	min: Vec3d;
	max: Vec3d;

	constructor(min, max) {
		this.min = min;
		this.max = max;
	}

	fromCenteredBox(size) {
		this.max.copyFrom(size).divScalar(2);
		this.min.copyFrom(this.max).mulScalar(-1);
	}

	clone() {
		return new Bounds3d(this.min.clone(), this.max.clone());
	}
}
