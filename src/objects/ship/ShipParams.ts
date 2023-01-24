import { Coordinate } from "@/common/meta";

export interface ShipParams {
  img: HTMLImageElement;

  /**
   * time in ms until draw (not precise, uses delta)
   */
  delay?: number;

  fire: {
    /**
     * 0 (or absent): won't fire
     */
    rate: number;

    /**
     * - SIMPLE: fire at `movement.angle`
     * - ACCURATE: fire directly at player
     * - LOOSE: fire at player but w/ random deviation
     * @default "SIMPLE" // (or none, if fireRate = 0)
     */
    precision?: "SIMPLE" | "LOOSE" | "ACCURATE";
  };

  movement: {
    /**
     * remember to:
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
     *  - `y` will ALWAYS be 0
     */
    start: Coordinate;

    /**
     * spawn angle in degrees
     * @default 0
     */
    angle: number;

    /**
     * velocity multiplier (`0 < speed <= 1`)
     * @default 0.1
     */
    speed?: number;

    /**
     * - `LINEAR`: move as a rect
     * - `ARC`: move as a arc
     * @default "LINEAR"
     */
    // pattern?: "LINEAR" | "8" | "ARC";
  };
}
