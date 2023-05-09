import { DebugParams } from "./debug";

export interface Boundaries {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export function p(x: number, y: number): Point {
  return { x, y };
}

export interface HitBox {
  x: number;
  y: number;
  radius: number;
}

export interface GameState {
  get debug(): DebugParams;
  get delta(): number;
  get worldBoundaries(): Boundaries;
  get player(): HitBox;
}

export interface Destroyable {
  destroy(): void;
}

export type Concrete<T> = {
  [Property in keyof T]-?: T[Property];
};

export interface Drawable {
  update(state: GameState): void;
  draw(c: CanvasRenderingContext2D): void;
  get isActive(): boolean;
}
