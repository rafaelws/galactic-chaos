import { GameObjectParams } from "../shared";

export interface RockParams extends GameObjectParams {
  img: HTMLImageElement;

  /**
   * Infinite rotation over its own center.
   *
   * Value in degrees.
   *
   * @default 0 //deg (positive=clockwise, negative=counterclockwise, 0=no rotation)
   */
  selfRotation?: number;
}
