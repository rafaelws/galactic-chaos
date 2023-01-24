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
  get delta(): number;
  get worldBoundaries(): Boundaries;
  get player(): HitBox;
  set player(hitbox: HitBox);
}

export interface Drawable {
  get isActive(): boolean;
  get hitbox(): HitBox;
  update(state: GameState): void;
  draw(c: CanvasRenderingContext2D): void;
}

export interface Destroyable {
  destroy(): void;
}
