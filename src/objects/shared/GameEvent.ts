export interface HpEventData {
  maxHp: number;
  hp: number;
}

export enum GameEvent {
  Pause = "pause",
  Quit = "Quit",
  GameOver = "GameOver",
  Spawn = "Spawn",
  PlayerHp = "PlayerHp",
  BossHp = "BossHp",
  GameEnd = "GameEnd",
  NextLevel = "NextLevel",
  BossDefeated = "BossDefeated",
}
