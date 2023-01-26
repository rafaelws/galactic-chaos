import { atan2 } from "@/common/math";
import {
  Boundaries,
  Concrete,
  Coordinate,
  GameState,
  HitBox,
} from "@/common/meta";
import { ImpactParams } from "./ImpactParams";

export abstract class GameObject implements GameObject {
  protected x = NaN;
  protected y = NaN;
  protected width = 0;
  protected height = 0;
  protected cx = 0;
  protected cy = 0;
  protected doubleWidth = 0;
  protected doubleHeight = 0;

  protected active = true;
  protected debug = false;

  protected hp: number;
  protected impact: Concrete<ImpactParams>;

  constructor(hp: number, impact: ImpactParams) {
    this.hp = hp || 1;
    this.impact = {
      power: 1,
      resistance: 0,
      collisionTimeout: 100,
      ...impact,
    };
  }

  protected setDimensions({ width, height }: Boundaries) {
    // TODO handle screen resize
    this.width = width;
    this.height = height;
    this.cx = width * 0.5;
    this.cy = height * 0.5;
    this.doubleHeight = height * 2;
    this.doubleWidth = width * 2;
  }

  protected isInboundsDoubled(worldBoundaries: Boundaries): boolean {
    return (
      this.x + this.doubleWidth < 0 ||
      this.y + this.doubleHeight < 0 ||
      this.x - this.doubleWidth > worldBoundaries.width ||
      this.y - this.doubleHeight > worldBoundaries.height
    );
  }

  protected isInbounds(worldBoundaries: Boundaries): boolean {
    return (
      this.x + this.width < 0 ||
      this.y + this.height < 0 ||
      this.x - this.width > worldBoundaries.width ||
      this.y - this.height > worldBoundaries.height
    );
  }

  protected calculateRotation(to: Coordinate): number {
    const { x, y } = this.hitbox;
    return -atan2({ x, y }, to);
  }

  protected abstract setStartingPoint(worldBoundaries: Boundaries): void;
  protected abstract move(state: GameState): void;
  public abstract handleHit(power: number): void;
  protected abstract checkCollision(player: HitBox): void;

  public update(state: GameState): void {
    this.debug = state.debug;

    if (isNaN(this.x) && isNaN(this.y))
      this.setStartingPoint(state.worldBoundaries);
  }

  public abstract draw(c: CanvasRenderingContext2D): void;

  public get isActive(): boolean {
    return this.active;
  }

  public get hitbox(): HitBox {
    return { radius: this.cy, x: this.x + this.cx, y: this.y + this.cy };
  }
}
