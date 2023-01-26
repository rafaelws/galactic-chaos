import { Coordinate } from "@/common/meta";

export interface ShipImpact {
  /**
   * Impact (collision) power (integer > 0)
   * @default 1
   */
  power?: number;

  /**
   * While `hp > 0` will hit again
   *
   * Uses `gameState.delta`
   *
   * It is a time window, so the player
   * can react to consecutive impacts
   *
   * @default 100 //ms (if hp > 1)
   */
  collisionTimeout?: number;

  /**
   * Defines the amount of damage taken when
   * the impact occurs.
   *
   * Considerations:
   *  - If power == resistance, no damage is taken
   *  - If power > resistance, take damage (`damage = power - resistance`)
   *  - If power < resistance, heal (`heal = resistance - power`)
   *
   * @default 0
   */
  resistance?: number;
}

export interface ShipFire {
  /**
   * Interval between shots in `ms`
   *
   * @default 0 // won't fire
   */
  rate?: number;

  /**
   * Projectile impact (collision) power (integer > 0)
   * @default 1
   */
  power?: number;

  /**
   * Works **ONLY** if `precision` is set to `"SIMPLE"`
   *
   * @default 180 //deg (pointing down)
   */
  angle?: number;

  /**
   * - SIMPLE: fire at `angle`
   * - ACCURATE: fire directly at player
   * - LOOSE: fire at player w/ random deviation
   * @default "SIMPLE" // (or none, if rate == 0)
   */
  precision?: "SIMPLE" | "LOOSE" | "ACCURATE";
}

export interface ShipMovement {
  /**
   * remember to:
   *  - spawn outside the canvas
   *  - set `movement.angle` accordingly (positive or negative)
   *  - `x` and `y` are decimals (0 <= `n` <= 1)
   *  - `x`: 0 is left, 1 is right
   *  - `y`: 0 is top, 1 is bottom
   *
   * When setting `y`:
   *  - `x` should be either 0 or 1
   *
   * When setting `x`:
   *  - `y` will ALWAYS be 0
   */
  start: Coordinate;

  /**
   * spawn angle in degrees
   * @default 0
   */
  angle: number;

  /**
   * velocity multiplier (`0 < speed <= 1`)
   * @default 0.1
   */
  speed?: number;

  /**
   * - `LINEAR`: move as a rect
   * - `ARC`: move as a arc
   * @default "LINEAR"
   */
  // pattern?: "LINEAR" | "8" | "ARC";
}

export interface ShipParams {
  img: HTMLImageElement;

  /**
   * How many shots it takes to be destroyed (integer > 0)
   * @default 1
   */
  hp?: number;

  /**
   * time in ms until draw (not precise, uses delta)
   */
  delay?: number;

  impact?: ShipImpact;

  fire: ShipFire;

  movement: ShipMovement;
}
