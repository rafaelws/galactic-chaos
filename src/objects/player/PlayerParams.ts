import { Coordinate } from "@/common/meta";

export interface PlayerParams {
  img: HTMLImageElement;

  /**
   * How many shots it takes to be destroyed (integer > 0)
   * @default 10
   */
  hp?: number;

  /**
   * starting point in %
   * (0 <= x <= 1)
   * (0 <= y <= 1)
   *
   * Note: when setting y:
   *  - 0 is top, 1 is bottom
   *  - set `angle` accordingly (positive or negative)
   *  - set `x` to either 1 or 0
   *
   * @default { y: 0.95, x: 0.5 }
   */
  start?: Coordinate;
}
