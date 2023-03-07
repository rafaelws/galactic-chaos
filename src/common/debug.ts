export enum GameObjectName {
  Ship = "SHIP",
  Boss = "BOSS",
  Rock = "ROCK",
  Player = "PLAYER",
  PlayerItem = "PLAYER_ITEM",
  PlayerProjectile = "PLAYER_PROJECTILE",
  EnemyProjectile = "ENEMY_PROJECTILE",
}

export const debugProfiles = {
  Player: [
    GameObjectName.Player,
    GameObjectName.PlayerProjectile,
    GameObjectName.PlayerItem,
  ],
  Mobs: [
    GameObjectName.Ship,
    GameObjectName.EnemyProjectile,
    GameObjectName.Rock,
  ],
  Boss: [GameObjectName.Boss, GameObjectName.EnemyProjectile],
  Enemies: [
    GameObjectName.Ship,
    GameObjectName.EnemyProjectile,
    GameObjectName.Rock,
    GameObjectName.Boss,
  ],
} as const;

export interface DebugParams {
  // true: all, false: none
  entities: GameObjectName[] | boolean;
  global: boolean;
  hitboxes: boolean;
  trajectory: boolean;
  statusText: boolean;
}

export const NoDebug: DebugParams = {
  entities: false,
  global: false,
  hitboxes: false,
  trajectory: false,
  statusText: false,
} as const;
