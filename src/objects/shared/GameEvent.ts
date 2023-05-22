export interface HpEventData {
  maxHp: number;
  hp: number;
}

export enum GameEvent {
  Pause = "Pause",
  Spawn = "Spawn",
  Quit = "Quit",
  GameOver = "GameOver",
  PlayerHp = "PlayerHp",
  BossHp = "BossHp",
  GameEnd = "GameEnd",
  // TODO the below events are either not being used or being used inappropriately
  NextLevel = "NextLevel",
  BossDefeated = "BossDefeated",
}
