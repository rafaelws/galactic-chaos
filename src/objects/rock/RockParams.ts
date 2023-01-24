import { Coordinate } from "@/common/meta";

export interface RockParams {
  img: HTMLImageElement;

  /**
   * How many shots it takes to be destroyed (integer > 0)
   * @default 1
   */
  hp?: number;

  /**
   * Impact (collision) power (integer > 0)
   * @default 1
   */
  power?: number;

  /**
   * While `hp > 0` will hit again
   *
   * Uses `gameState.delta`
   *
   * It is a time window, so the player
   * can react to consecutive impacts
   *
   * @default 100 //ms (if hp > 1)
   */
  collisionTimeout?: number;

  /**
   * starting point in %
   * (0 <= x <= 1)
   * (0 <= y <= 1)
   *
   * Note: when setting y:
   *  - 0 is top, 1 is bottom
   *  - set `angle` accordingly (positive or negative)
   *  - set `x` to either 1 or 0
   */
  start: Coordinate;

  /**
   * spawn angle in degrees
   * @default 0 //deg
   */
  angle?: number;

  /**
   * time in ms until spawn/draw (not precise, uses delta)
   * @default 0 //ms (immediately)
   */
  delay?: number;

  /**
   * velocity multiplier (0 to 1)
   * @default 0.1
   */
  speed?: number;

  /**
   * to worldBoundaries.width (0 to 1)
   */
  // proportion?: number;

  /**
   * infinite rotation over its own center
   */
  rotation?: {
    direction: "CLOCKWISE" | "COUNTERCLOCKWISE";
    /**
     * rotation velocity multiplier (0 to 1)
     */
    speed: number;
  };
}
