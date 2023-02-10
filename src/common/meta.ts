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
  get debug(): boolean;
  get delta(): number;
  get worldBoundaries(): Boundaries;
  get player(): HitBox;
  set player(hitbox: HitBox);
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
