import { Coordinate, HitBox } from "./meta";

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

export const R180 = toRad(180);

export function toRad(deg: number) {
  return deg * RAD;
}

export function toDeg(rad: number) {
  return rad * DEG;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function randInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * `x` and `y` for both `from` and `to` are advised to be the center of the object
 *
 * `{x: this.x + this.cx, y: this.y + this.cy }`
 * @returns angle in radians
 */
export function atan2(from: Coordinate, to: Coordinate) {
  return Math.atan2(from.x - to.x, from.y - to.y);
}

// TODO verify if Math.hypot can be optimized
export function hasCollided(a: HitBox, b: HitBox) {
  // const hypot = Math.hypot(a.x - b.x, a.y - b.y);
  // return hypot < a.radius + b.radius;
  // >sqrt removed
  const x = a.x - b.x;
  const y = a.y - b.y;
  const radius = a.radius + b.radius;
  return x * x + y * y < radius * radius;
}

// unclamped
export function ulerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

export function clamp01(n: number) {
  if (n < 0) return 0;
  else if (n > 1) return 1;
  else return n;
}

export function lerp(start: number, end: number, t: number) {
  // return start * (1 - t) + end * t;
  // return end * t + start * (1.0 - t);

  // return start + (end - start) * clamp01(t);
  // return start * (1 - t) + end * t;

  // return Math.pow(start * (end / start), t);
  return start + (end - start) * clamp01(t);
}

export function lerpCoordinate(
  start: Coordinate,
  end: Coordinate,
  t: number
): Coordinate {
  return {
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t),
  };
}

export function ulerpCoordinate(
  start: Coordinate,
  end: Coordinate,
  t: number
): Coordinate {
  return {
    x: ulerp(start.x, end.x, t),
    y: ulerp(start.y, end.y, t),
  };
}

export const shaper = {
  frameIndependent(t: number, delta: number) {
    return 1.0 - Math.pow(t, delta);
  },
  easeInOutSine(t: number) {
    return -(Math.cos(Math.PI * t) - 1) * 0.5;
  },
};
