export interface HpEventData {
  maxHp: number;
  hp: number;
}

export enum GameEvent {
  pause = "pause",
  quit = "quit",
  gameOver = "gameOver",
  spawn = "spawn",
  playerHp = "playerHp",
  bossHp = "bossHp",
  gameEnd = "gameEnd",
  nextLevel = "nextLevel",
}
