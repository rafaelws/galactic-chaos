import { ImpactParams } from "./ImpactParams";
import { MovementParams } from "./MovementParams";

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

  /**
   * to worldBoundaries.width (0 to 1)
   */
  // proportion?: number;

  impact?: ImpactParams;
  movement?: MovementParams;
}
