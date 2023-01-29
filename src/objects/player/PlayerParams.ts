import { GameObjectParams } from "../shared";

export interface PlayerParams extends GameObjectParams {
  img: HTMLImageElement;

  /**
   * How many shots it takes to be destroyed (integer > 0)
   * @default 10
   */
  hp?: number;
}
