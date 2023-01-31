import { Coordinate } from "@/common/meta";
import { GameObjectParams } from "../shared";

export type Effect = {
  type: "HEAL" | "SHIELD";
  amount: number;
};

export interface PlayerItemParams extends GameObjectParams {
  img: HTMLImageElement;

  effect: Effect;

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
