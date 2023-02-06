export interface HpEvent {
  maxHp: number;
  hp: number;
}

export enum GameEvent {
  pause = "pause",
  quit = "quit",
  spawn = "spawn",
  playerHp = "playerHp",
  bossHp = "bossHp",
}
