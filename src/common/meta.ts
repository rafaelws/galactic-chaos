import { ControlState } from "./controls";

export interface Boundaries {
  width: number;
  height: number;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface HitBox {
  x: number;
  y: number;
  radius: number;
}

export interface PlayerStatus {
  position: Coordinate;
  boundaries: Boundaries;
  hitbox: HitBox;
  rotation: number;
}

export interface GameState {
  worldBoundaries: Boundaries;
  delta: number;
  debug: boolean;
  // playerStatus: PlayerStatus;
}

export interface Drawable {
  update(state: GameState, controls: ControlState): void;
  draw(c: CanvasRenderingContext2D, state: GameState): void;
}

export interface Destroyable {
  destroy(): void;
}
