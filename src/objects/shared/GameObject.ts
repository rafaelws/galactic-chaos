import { Clock, GameEvent } from "@/common";
import { trigger } from "@/common/events";
import { atan2, toRad } from "@/common/math";
import {
  Boundaries,
  Concrete,
  Coordinate,
  GameState,
  HitBox,
} from "@/common/meta";
import { Effect, PlayerItem } from "@/objects";
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

  protected spawnOnDestroy?: PlayerItem;

  constructor(params: GameObjectParams) {
    this.hp = params.hp || 1;

    this.spawnClock = new Clock(params.spawnDelay || 0);

    this.movement = {
      start: { x: 0.5, y: 0 },
      angle: 0,
      speed: 0.1,
      ...params.movement,
    };

    this.impact = {
      power: 1,
      resistance: 0,
      collisionTimeout: 250,
      ...params.impact,
    };

    this.impactClock = new Clock(this.impact.collisionTimeout, true);

    this.spawnOnDestroy = params.spawnOnDestroy;
  }

  protected setDirection() {
    const movementAngle = toRad(this.movement.angle);
    this.direction.x = Math.sin(movementAngle);
    this.direction.y = Math.cos(movementAngle);
  }

  protected setDimensions({ width, height }: Boundaries): void {
    // TODO handle screen resize
    this.width = width;
    this.height = height;
    this.cx = width * 0.5;
    this.cy = height * 0.5;
    this.doubleHeight = height * 2;
    this.doubleWidth = width * 2;
  }

  // override if necessary
  protected setStartingPoint(worldBoundaries: Boundaries): void {
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

  protected isOutbounds(worldBoundaries: Boundaries): boolean {
    return (
      this.x + this.width < 0 ||
      this.y + this.height < 0 ||
      this.x - this.width > worldBoundaries.width ||
      this.y - this.height > worldBoundaries.height
    );
  }

  protected isOutboundsDoubled(worldBoundaries: Boundaries): boolean {
    return (
      this.x + this.doubleWidth < 0 ||
      this.y + this.doubleHeight < 0 ||
      this.x - this.doubleWidth > worldBoundaries.width ||
      this.y - this.doubleHeight > worldBoundaries.height
    );
  }

  protected calculateRotation(to: Coordinate): number {
    const { x, y } = this.hitbox;
    return -atan2({ x, y }, to);
  }

  // override if necessary
  protected move(state: GameState): void {
    this.x += this.direction.x * this.movement.speed * state.delta;
    this.y += this.direction.y * this.movement.speed * state.delta;
  }

  // override if necessary
  public update(state: GameState): void {
    this.debug = state.debug;
    if (!this.hasStartingPoint) this.setStartingPoint(state.worldBoundaries);

    this.spawnClock.increment(state.delta);
    this.impactClock.increment(state.delta);
  }

  public abstract draw(c: CanvasRenderingContext2D): void;

  public handleHit(power: number): void {
    this.hp -= power;
    if (this.hp <= 0) {
      if (!!this.spawnOnDestroy) {
        this.spawnOnDestroy.setPosition({ x: this.x, y: this.y });
        trigger(GameEvent.spawn, this.spawnOnDestroy);
      }
      this.active = false;
    }
  }

  public handleImpact(power: number): number {
    if (this.impactClock.pending) return 0;
    this.impactClock.reset();
    this.handleHit(power - this.impact.resistance);
    return this.impact.power;
  }

  public effect(): Effect | null {
    return null;
  }

  /**
   * Returns true if x and y are set and the spawnClock has finished
   */
  protected get isReady(): boolean {
    return this.hasStartingPoint && !this.spawnClock.pending;
  }

  /**
   * Returns true if x and y are set
   */
  protected get hasStartingPoint(): boolean {
    return !(isNaN(this.x) && isNaN(this.y));
  }

  public get isActive(): boolean {
    return this.active;
  }

  public get hitbox(): HitBox {
    return { radius: this.cy, x: this.x + this.cx, y: this.y + this.cy };
  }

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
}
