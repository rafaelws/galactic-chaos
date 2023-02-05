import { GameObjectParams, ImpactParams, MovementParams } from "../shared";

export interface RockParams extends GameObjectParams {
  img: HTMLImageElement;

  /**
   * Infinite rotation over its own center.
   *
   * Value in degrees (positive or negative) to increment at each update.
   *
   * @default 0 //deg (no rotation)
   */
  rotationSpeed?: number;

  movement?: MovementParams;
  impact?: ImpactParams;
}
