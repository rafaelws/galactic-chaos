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

export function hasCollided(a: HitBox, b: HitBox) {
  const hypot = Math.hypot(a.x - b.x, a.y - b.y);
  return hypot < a.radius + b.radius;
}
