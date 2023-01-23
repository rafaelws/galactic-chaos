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
