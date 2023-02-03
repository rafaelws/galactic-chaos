import { Coordinate } from "@/common/meta";

export interface MovementParams {
  /**
   * Relative measure (will be calculated against worldBoundaries)
   *
   * Remember to:
   *  - spawn outside the canvas
   *  - set `movement.angle` accordingly (positive or negative)
   *  - `x` and `y` are decimals (0 <= `n` <= 1)
   *  - `x`: 0 is left, 1 is right
   *  - `y`: 0 is top, 1 is bottom
   *
   * When setting `y`:
   *  - `x` should be either 0 or 1
   *
   * When setting `x`:
   *  - `y` should be ALWAYS 0
   *
   * @default { x: 0.5, y: 0 }
   */
  start?: Coordinate;

  /**
   * Spawn angle in degrees.
   *
   * Advised to be set between -90 and 90
   * (negative=left, positive=right)
   *
   * @default 0
   */
  angle?: number;

  /**
   * Velocity multiplier (`0 < speed <= 1`)
   * @default 0.1
   */
  speed?: number;
}
