import { Coordinate } from "@/common/meta";
import { MovementParams } from "./MovementParams";

export interface Cycle {
  /**
   * Relative increment/decrement to every new cycle (0 < n < 1).
   *
   * Negative values accepted.
   * @default { x: 0, y: 0 }
   */
  increment?: Coordinate;

  /**
   * Max relative position before restarting the cycle (0 < n < 1).
   * @default { x: 0, y: 0 }
   */
  // threshold?: Coordinate;

  /**
   * If true, is restarts the movement
   * from the latest point.
   *
   * @default false
   */
  // reverse?: boolean;
}

export interface CyclicMovementParams extends MovementParams {
  /**
   * Describes a cyclic movement.
   */
  cycle: Cycle;
}
