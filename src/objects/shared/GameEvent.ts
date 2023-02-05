export interface HpEvent {
  maxHp: number;
  hp: number;
}

export enum GameEvent {
  // start = "start",
  // quit = "quit",
  // pause = "pause",
  spawn = "spawn",
  playerHp = "playerHp",
  bossHp = "bossHp",
}
