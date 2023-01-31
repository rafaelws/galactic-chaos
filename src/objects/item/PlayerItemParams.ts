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
   * Where to spawn the item.
   *
   * can be set later with PlayerItem#setPosition()
   *
   * @default { x: 0, y: 0 }
   */
  position?: Coordinate;

  /**
   * How much time does it take to disappear
   *
   * @default 5000 //ms
   */
  timeout?: number;
}
