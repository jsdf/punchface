export type Vec3dInit = {x: number; y: number; z: number};

export class Vec3d {
  x: number = 0;
  y: number = 0;
  z: number = 0;

  constructor(init?: Vec3dInit) {
    if (init) {
      this.x = init.x;
      this.y = init.y;
      this.z = init.z;
    }
  }

  origin() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  init(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone() {
    return new Vec3d(this);
  }

  copyFrom(other: Vec3dInit) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    return this;
  }

  add(other: Vec3dInit) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  sub(other: Vec3dInit) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }

  normalise() {
    if (this.x === 0 && this.y === 0 && this.z === 0) return this;

    const magnitude = Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z
    );
    this.x /= magnitude;
    this.y /= magnitude;
    this.z /= magnitude;
    return this;
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  addScalar(scalar: number) {
    this.x += scalar;
    this.y += scalar;
    this.z += scalar;
    return this;
  }

  subScalar(scalar: number) {
    this.x -= scalar;
    this.y -= scalar;
    this.z -= scalar;
    return this;
  }

  mulScalar(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  divScalar(scalar: number) {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
    return this;
  }

  distanceTo(other: Vec3dInit) {
    return Math.sqrt(
      (this.x - other.x) ** 2 +
        (this.y - other.y) ** 2 +
        (this.z - other.z) ** 2
    );
  }

  directionTo(other: Vec3dInit) {
    return new Vec3d(other).sub(this).normalise();
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    };
  }

  toString() {
    return `{x:${this.x.toFixed(2)}, y:${this.y.toFixed(2)}, z:${this.z.toFixed(
      2
    )}}`;
  }

  equals(other: Vec3dInit): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }
}
