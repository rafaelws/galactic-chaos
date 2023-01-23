import { Coordinate, Drawable, GameState } from "@/common/meta";

export interface LaunchParams {
  from: Coordinate;

  /**
   * angle in radians
   */
  angle: number;

  /**
   * use `worldBoundaries` and `delta`
   */
  readonly gameState: GameState;
}

export interface Launcher {
  launch(params: LaunchParams): void;
  setDelay(delay: number): void;
  get drawables(): Drawable[];
}
