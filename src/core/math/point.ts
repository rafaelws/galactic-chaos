import { Point } from "../meta";
import { lerp, LerpVariation } from "./lerp";

export const PZero: Point = { x: 0, y: 0 } as const;

/**
 * point lerp
 * default: precise, clamp01
 */
export function plerp(
  start: Point,
  end: Point,
  t: number,
  variation: LerpVariation = "pc01",
  min = 0,
  max = 1
): Point {
  return {
    x: lerp(start.x, end.x, t, variation, min, max),
    y: lerp(start.y, end.y, t, variation, min, max),
  };
}

/**
 * sum x and y of given points
 */
export function psum(...points: Point[]) {
  let x = 0;
  let y = 0;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    x += p.x;
    y += p.y;
  }

  return { x, y };
}

/**
 * Multiplies x and y by `n`
 */
export function pmtpn(p: Point, n: number) {
  return { x: p.x * n, y: p.y * n };
}

/**
 * signal inversion
 */
export function psi(p: Point) {
  return { x: -p.x, y: -p.y };
}

export function pfloor({ x, y }: Point) {
  return { x: Math.floor(x), y: Math.floor(y) };
}

export function pdivn(p: Point, n: number) {
  return { x: p.x / n, y: p.y / n };
}

/**
 * Chainable point functions
 */
export function PointM(point: Point) {
  let value = { ...point };

  return {
    value() {
      return value;
    },
    lerp(end: Point, t: number) {
      value = plerp(value, end, t);
      return this;
    },
    sum(...all: Point[]) {
      value = psum(value, ...all);
      return this;
    },
    mtpn(n: number) {
      value = pmtpn(value, n);
      return this;
    },
    pdivn(n: number) {
      value = pdivn(value, n);
      return this;
    },
    floor() {
      value.x = Math.floor(value.x);
      value.y = Math.floor(value.y);
      return this;
    },
    trunc() {
      value.x = Math.trunc(value.x);
      value.y = Math.trunc(value.y);
      return this;
    },
    si() {
      value = psi(value);
      return this;
    },
  };
}
