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

export interface GameState {
  worldBoundaries: Boundaries;
  delta: number;
  debug: boolean;
  // playerStatus: PlayerStatus;
}

export interface Drawable {
  isActive(): boolean;
  update(state: GameState, controls: ControlState): void;
  draw(c: CanvasRenderingContext2D): void;
}

export interface Destroyable {
  destroy(): void;
}
