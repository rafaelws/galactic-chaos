export interface ImpactParams {
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
   * @default 250 //ms (if hp > 1)
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
