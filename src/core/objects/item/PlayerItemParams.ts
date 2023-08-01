import { Point } from "@/core/meta";

import { Effect } from "../shared";

export interface PlayerItemParams {
  img: HTMLImageElement;

  effect: Effect;

  /**
   * Where to spawn the item.
   *
   * can be set later with PlayerItem#setPosition()
   *
   * @default { x: 0, y: 0 }
   */
  position?: Point;

  /**
   * How much time does it take to disappear
   *
   * @default 5000 //ms
   */
  timeout?: number;
}
