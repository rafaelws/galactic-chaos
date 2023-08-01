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

const Variations = {
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
} as const;

const variationKeys = Object.keys(Variations) as Array<keyof typeof Variations>;
export type LerpVariation = (typeof variationKeys)[number];

export function lerp(
  a: number,
  b: number,
  t: number,
  variation: LerpVariation = "pc01",
  min = 0,
  max = 1
): number {
  return Variations[variation](a, b, t, min, max);
}
