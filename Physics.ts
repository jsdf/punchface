import {Vec3d} from "./Vec3d";
import {GameObject} from "./GameObject";

const PHYS_TIMESTEP = 1.0 / 60.0;
const PHYS_MAX_STEPS = 4;
const GRAVITY_FORCE = -300;

let idCounter = 0;

export class PhysBody {
	id = idCounter++;
	mass: number;
	massInverse: number;
	radius: number;
	radiusSquared: number;
	enabled = true;
	prevPosition = new Vec3d();
	// in verlet this is derived.
	// after integration, it represents the velocity for dt
	velocity = new Vec3d();
	// after integration, this represents the velocity for 1 second
	nonIntegralVelocity = new Vec3d();
	// this is really force (eg. in newtons) until after integration, when it
	// becomes acceleration
	acceleration = new Vec3d();
	// after integration, this represents the acceleration for 1 second
	nonIntegralAcceleration = new Vec3d();
	// this is the resultant acceleration from the 2x previous timestep
	prevAcceleration = new Vec3d();
	obj: GameObject;
	// position = new Vec3d();

	constructor(opts: {obj: GameObject; mass: number; radius: number}) {
		this.obj = opts.obj;
		this.mass = opts.mass;
		this.massInverse = 1.0 / opts.mass;
		this.radius = opts.radius;
		this.radiusSquared = opts.radius ** 2;
	}

	get position(): Vec3d {
		return this.obj.position;
	}

	integrateMotionSemiImplicitEuler(dt: number, drag: number) {
		// acceleration = force / mass
		// accelerationForDT = acceleration * dt
		// velocity = velocity + accelerationForDT
		// velocityForDT = velocity * dt
		// position = position + velocityForDT

		const newPosition = new Vec3d();
		/* Scale force by mass to calculate actual acceleration */
		// acceleration = ( force / mass )
		this.acceleration.mulScalar(this.massInverse);
		this.nonIntegralAcceleration = this.acceleration; // for debugging
		// accelerationForDT = acceleration * dt
		this.acceleration.mulScalar(dt);

		// velocity = velocity + accelerationForDT
		this.nonIntegralVelocity.add(this.acceleration);

		// velocityForDT = velocity * dt
		this.velocity.copyFrom(this.nonIntegralVelocity);
		this.velocity.mulScalar(dt);

		/* Apply friction. */
		this.velocity.mulScalar(drag);

		// position = position + velocityForDT;
		newPosition.copyFrom(this.position);
		newPosition.add(this.velocity);

		/* Store old position, update position to new position. */
		this.prevPosition.copyFrom(this.position);
		this.position.copyFrom(newPosition);

		/* Reset acceleration force. */
		this.prevAcceleration.copyFrom(this.acceleration);
		this.acceleration.origin();
	}

	update() {
		const gravity = new Vec3d({
			x: 0,
			y: GRAVITY_FORCE * this.mass,
			z: 0
		});
		this.applyForce(gravity); // apply gravity
	}

	applyForce(force: Vec3d) {
		this.acceleration.add(force);
	}

	toString() {
		return `{${this.constructor.name}:${this.id}}`;
	}
}

function floorClamp(body, floorHeight: number) {
	if (body.position.y - body.radius < floorHeight) {
		body.position.y = floorHeight + body.radius;
		body.nonIntegralVelocity.y = 0;
	}
}

export class Physics {
	accumulatedTime = 0.0;
	clock = 0.0;
	viscosity = 0.01;
	simulationRate = 1.0;
	timeScale = 1.0;
	dynamicTimestep = true;
	bodies = [];
	floorHeight = -100;

	integrateBodies(dt: number, drag: number) {
		for (const body of this.bodies) {
			if (body.enabled) {
				body.update(dt, drag);
			}
		}
		for (const body of this.bodies) {
			if (body.enabled /*&& !body.controlled*/) {
				body.integrateMotionSemiImplicitEuler(dt, drag);
			}
		}

		// do this after so we can fix any world penetration resulting from motion
		// integration
		for (const body of this.bodies) {
			floorClamp(body, this.floorHeight);
		}
	}

	step(now: number) {
		let time;
		let i;
		let timestep;
		let delta;
		let drag;
		// Initialise the clock on first step.
		if (this.clock == 0.0) {
			this.clock = now;
		}
		// Compute delta time since last step.
		time = now;
		// fixed delta for debugging
		time = this.dynamicTimestep
			? time
			: this.clock + 16.667 * this.timeScale * this.simulationRate;
		delta = time - this.clock;
		// sufficient change.

		if (delta > 0.0) {
			// Convert time to seconds.
			delta = delta * 0.001;
			// Drag is inversely proportional to viscosity.
			drag = 1.0 - this.viscosity;
			// Update the clock.
			this.clock = time;
			// Increment time accumulatedTime.
			// Don't accumulate any additional time if we're already more than 1 second
			// behind. This happens when the tab is backgrounded, and if this grows
			// large enough we won't be able to ever catch up.

			if (this.accumulatedTime < 1.0) {
				this.accumulatedTime = this.accumulatedTime + delta;
			} else {
				console.log(
					"physics: accumulated too much time, not accumulating any more\n"
				);
			}
			// Integrate until the accumulatedTime is empty or until the
			// maximum amount of iterations per step is reached.
			let i = 0;
			timestep = PHYS_TIMESTEP * this.timeScale;
			while (this.accumulatedTime >= timestep && i < PHYS_MAX_STEPS) {
				// Integrate bodies by fixed timestep.
				this.integrateBodies(timestep, drag);
				/* Reduce accumulatedTime by one timestep. */
				this.accumulatedTime = this.accumulatedTime - timestep;
				i++;

				// TODO: updating physics step multiple times without running game update
				// step is probably wrong, as forces are reset after each step
				break;
			}
		}
	}
}
