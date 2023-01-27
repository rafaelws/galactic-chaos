import { atan2 } from "@/common/math";
import {
  Boundaries,
  Concrete,
  Coordinate,
  GameState,
  HitBox,
} from "@/common/meta";
import { Clock } from "./Clock";
import { GameObjectParams } from "./GameObjectParams";
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
  protected rotation = 0;

  protected active = true;
  protected debug = false;

  protected hp: number;

  protected impact: Concrete<ImpactParams>;

  protected spawnClock: Clock;
  protected impactClock: Clock;

  constructor(params: GameObjectParams) {
    this.hp = params.hp || 1;

    this.spawnClock = new Clock(params.spawnDelay || 0);

    this.impact = {
      power: 1,
      resistance: 0,
      collisionTimeout: 100,
      ...params.impact,
    };

    this.impactClock = new Clock(this.impact.collisionTimeout, true);
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

  protected isOutboundsDoubled(worldBoundaries: Boundaries): boolean {
    return (
      this.x + this.doubleWidth < 0 ||
      this.y + this.doubleHeight < 0 ||
      this.x - this.doubleWidth > worldBoundaries.width ||
      this.y - this.doubleHeight > worldBoundaries.height
    );
  }

  protected isOutbounds(worldBoundaries: Boundaries): boolean {
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
  protected abstract checkCollision(player: HitBox): void;
  public abstract handleHit(power: number): void;

  protected preUpdate(state: GameState) {
    this.debug = state.debug;

    if (this.spawnClock.pending) {
      this.spawnClock.increment(state.delta);
      return;
    }

    if (isNaN(this.x) && isNaN(this.y))
      this.setStartingPoint(state.worldBoundaries);

    this.impactClock.increment(state.delta);
  }

  public abstract update(state: GameState): void;
  public abstract draw(c: CanvasRenderingContext2D): void;

  protected drawDebug(c: CanvasRenderingContext2D): void {
    const _y = Math.floor(this.y);
    const _x = Math.floor(this.x);
    const rad = Math.floor(this.rotation);
    c.strokeStyle = "red";
    c.fillStyle = "white";
    c.font = `${16}px sans-serif`;

    // c.textAlign = "center";
    c.fillText(`[${_x}, ${_y}] ${rad}°`, _x, _y);

    c.beginPath();
    c.arc(this.hitbox.x, this.hitbox.y, this.hitbox.radius, 0, Math.PI * 2);
    c.stroke();
  }

  protected get ready(): boolean {
    return !(isNaN(this.x) || isNaN(this.y) || this.spawnClock.pending);
  }

  public get isActive(): boolean {
    return this.active;
  }

  public get hitbox(): HitBox {
    return { radius: this.cy, x: this.x + this.cx, y: this.y + this.cy };
  }
}
