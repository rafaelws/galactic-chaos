import { Coordinate } from "@/common/meta";
import { GameObjectParams } from "../shared";

export type ItemType = "HEAL" | "SHIELD";

export interface ItemParams extends GameObjectParams {
  img: HTMLImageElement;

  type: ItemType;

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
