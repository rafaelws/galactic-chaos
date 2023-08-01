export enum FirePrecision {
  Simple = "SIMPLE",
  Loose = "LOOSE",
  Accurate = "ACCURATE",
}

export interface FireParams {
  /**
   * Interval between shots in `ms`
   *
   * @default 0 // won't fire
   */
  rate?: number;

  /**
   * Projectile impact (collision) power (integer > 0)
   * @default 1
   */
  power?: number;

  /**
   * Works **ONLY** if `precision` is set to `"SIMPLE"`
   *
   * @default 180 //deg (pointing down)
   */
  angle?: number;

  /**
   * - Simple: fire at `angle`
   * - Accurate: fire directly at player
   * - Loose: fire at player w/ randomized +-25%
   * @default FirePrecision.Simple // (or none, if rate == 0)
   */
  precision?: FirePrecision;
}
