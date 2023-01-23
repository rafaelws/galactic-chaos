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
  delta: number;
  worldBoundaries: Boundaries;
  playerHitbox?: HitBox;
}

export interface Drawable {
  isActive(): boolean;
  update(state: GameState): void;
  draw(c: CanvasRenderingContext2D): void;
}

export interface Destroyable {
  destroy(): void;
}
