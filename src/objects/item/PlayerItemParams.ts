import { Coordinate } from "@/common/meta";
import { GameObjectParams } from "../shared";

export type PlayerItemType = "HEAL" | "SHIELD";

export interface PlayerItemParams extends GameObjectParams {
  img: HTMLImageElement;

  type: PlayerItemType;

  /**
   * where to spawn the item
   */
  at: Coordinate;

  /**
   * How much time does it take to disappear
   *
   * @default 10000 //ms (10s)
   */
  timeout?: number;
}
