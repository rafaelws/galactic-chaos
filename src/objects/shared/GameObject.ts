import { atan2, toRad } from "@/common/math";
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
import { MovementParams } from "./MovementParams";

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

  protected movement: Concrete<MovementParams>;
  protected direction: Coordinate = { x: 0, y: 0 };

  protected spawnClock: Clock;
  protected impactClock: Clock;

  constructor(params: GameObjectParams) {
    this.hp = params.hp || 1;

    this.spawnClock = new Clock(params.spawnDelay || 0);

    this.movement = {
      start: { x: 0.5, y: 0 },
      angle: 0,
      speed: 0.1,
      ...params.movement,
    };

    const movementAngle = toRad(this.movement.angle);
    this.direction.x = Math.sin(movementAngle);
    this.direction.y = Math.cos(movementAngle);

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

  protected setMovementStartingPoint(worldBoundaries: Boundaries) {
    const { angle, start } = this.movement;

    let x = 0;
    let y = 0;

    if (start.y > 0) {
      y = start.y * worldBoundaries.height;
      x = angle > 0 ? -this.width : worldBoundaries.width;
    } else {
      y = -this.height;
      x = start.x * worldBoundaries.width;
    }

    this.x = x;
    this.y = y;
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

    if (!this.hasStartingPoint) this.setStartingPoint(state.worldBoundaries);

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

  public get hasStartingPoint(): boolean {
    return !(isNaN(this.x) && isNaN(this.y));
  }
}
