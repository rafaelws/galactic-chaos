import { GameObject } from "./GameObject";

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
  spawnTimeout?: number;

  /**
   * Spawn objects at the last position after
   * the object is destroyed.
   *
   * @default []
   */
  spawnables?: GameObject[];
}
