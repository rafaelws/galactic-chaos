import { GameObjectParams } from "../shared";

export interface RockParams extends GameObjectParams {
  img: HTMLImageElement;

  /**
   * Infinite rotation over its own center.
   *
   * Value in degrees (positive or negative).
   *
   * @default 0 //deg (no rotation)
   */
  selfRotation?: number;
}
