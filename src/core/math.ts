import { HitBox, Point } from "./meta";

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
 * Random number In Range
 *
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function rir(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Random Integer In Range
 *
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function riir(min: number, max: number) {
  return Math.floor(rir(min, max));
}

export function dice() {
  return rir(0, 2) > 1;
}

/**
 * `x` and `y` for both `from` and `to` are advised
 * to be the center of the object
 *
 * `{x: this.x + this.cx, y: this.y + this.cy }`
 * @returns angle in radians
 */
export function atan2(from: Point, to: Point) {
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

export function clamp(t: number, min: number, max: number) {
  if (t < min) return min;
  else if (t > max) return max;
  else return t;
}

export function clamp01(t: number) {
  if (t < 0) return 0;
  else if (t > 1) return 1;
  else return t;
}

export const lerp = {
  // precise, unclamped
  p(a: number, b: number, t: number) {
    return (1 - t) * a + t * b;
  },

  // imprecise, unclamped
  i(a: number, b: number, t: number) {
    return a + t * (b - a);
  },

  // precise, clamp01
  pc01(a: number, b: number, t: number) {
    return this.p(a, b, clamp01(t));
  },

  // imprecise, clamp01
  ic01(a: number, b: number, t: number) {
    return this.i(a, b, clamp01(t));
  },

  // precise, clamped
  pc(a: number, b: number, t: number, min: number, max: number) {
    return this.p(a, b, clamp(t, min, max));
  },

  // imprecise, clamped
  ic(a: number, b: number, t: number, min: number, max: number) {
    return this.i(a, b, clamp(t, min, max));
  },

  // shapes of `t`
  tShaper: {
    easeInOutSine(t: number) {
      return -(Math.cos(Math.PI * t) - 1) * 0.5;
    },
    parabola(t: number, k: number) {
      return Math.pow(4 * t * (1 - t), k);
    },
  },
};

export const point = {
  /**
   * precise, clamp01
   */
  lerp(start: Point, end: Point, t: number): Point {
    return {
      x: lerp.pc01(start.x, end.x, t),
      y: lerp.pc01(start.y, end.y, t),
    };
  },

  /**
   * sum n points
   */
  sum(...coords: Point[]) {
    let x = 0;
    let y = 0;

    for (let i = 0; i < coords.length; i++) {
      const c = coords[i];
      x += c.x;
      y += c.y;
    }

    return { x, y };
  },

  /**
   * Multiplies x and y by `n`
   */
  mtpn(c: Point, n: number) {
    return { x: c.x * n, y: c.y * n };
  },

  /**
   * signal inversion
   */
  si(c: Point) {
    return { x: -c.x, y: -c.y };
  },
};
