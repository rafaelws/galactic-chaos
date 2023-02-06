export interface HpEvent {
  maxHp: number;
  hp: number;
}

export enum GameEvent {
  pause = "pause",
  quit = "quit",
  gameOver = "gameover",
  spawn = "spawn",
  playerHp = "playerHp",
  bossHp = "bossHp",
}
