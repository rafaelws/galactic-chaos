import { ImpactParams } from "./ImpactParams";

export interface GameObjectParams {
  /**
   * How many shots it takes to be destroyed (integer > 0)
   * @default 1
   */
  hp?: number;

  /**
   * Time in ms until spawn (uses delta, not precise)
   * @default 0
   */
  spawnDelay?: number;

  impact?: ImpactParams;
}
