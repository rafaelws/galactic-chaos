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
   * - SIMPLE: fire at `angle`
   * - ACCURATE: fire directly at player
   * - LOOSE: fire at player w/ randomized +-25%
   * @default "SIMPLE" // (or none, if rate == 0)
   */
  precision?: "SIMPLE" | "LOOSE" | "ACCURATE";
}
