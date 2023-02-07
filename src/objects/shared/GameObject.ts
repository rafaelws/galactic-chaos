import { Clock } from "@/common";
import { trigger } from "@/common/events";
import {
  Boundaries,
  Coordinate,
  Drawable,
  GameState,
  HitBox,
} from "@/common/meta";
import { iterate } from "@/common/util";
import { GameEvent } from "./GameEvent";
import { Effect } from "./Effect";
import { GameObjectParams } from "./GameObjectParams";

export abstract class GameObject implements Drawable {
  // status
  protected hp: number;
  protected active = true;
  protected debug = false;

  // position
  protected x = NaN;
  protected y = NaN;
  protected rotation = 0;

  // dimensions
  protected cx = 0;
  protected cy = 0;
  protected width = 0;
  protected height = 0;
  protected doubleWidth = 0;
  protected doubleHeight = 0;

  protected spawnClock: Clock;

  protected spawnables: GameObject[];

  constructor(params: GameObjectParams) {
    this.hp = params.hp || 1;

    this.spawnClock = new Clock(params.spawnTimeout || 0);
    this.spawnables = params.spawnables || [];
  }

  // TODO handle screen resize
  protected setDimensions({ width, height }: Boundaries): void {
    this.width = width;
    this.height = height;
    this.cx = width * 0.5;
    this.cy = height * 0.5;
    this.doubleHeight = height * 2;
    this.doubleWidth = width * 2;
  }

  // ALWAYS override
  public update(state: GameState): void {
    this.debug = state.debug;
    this.spawnClock.increment(state.delta);
    // if (!this.hasPosition)
  }

  public abstract draw(c: CanvasRenderingContext2D): void;

  private spawnOnDestroy() {
    if (this.spawnables.length === 0) return;
    iterate(this.spawnables, (spawnable) => {
      spawnable.position = this.position;
      trigger(GameEvent.spawn, spawnable);
    });
  }

  protected hpLoss(amount: number): void {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.spawnOnDestroy();
      this.active = false;
    }
  }

  public abstract effect(): Effect;
  public abstract handleEffect(effect: Effect): void;

  /**
   * Returns true if x and y are NOT NaN
   */
  protected get hasPosition(): boolean {
    return !(isNaN(this.x) && isNaN(this.y));
  }

  protected get position(): Coordinate {
    return { x: this.x, y: this.y };
  }

  protected set position({ x, y }: Coordinate) {
    this.x = x;
    this.y = y;
  }

  protected get dimensions(): Boundaries {
    return { width: this.width, height: this.height };
  }

  protected get doubledDimensions(): Boundaries {
    return { width: this.doubleWidth, height: this.doubleHeight };
  }

  protected isOutbounds(
    world: Boundaries,
    { width, height }: Boundaries = this.doubledDimensions,
    { x, y }: Coordinate = this.position
  ): boolean {
    return (
      x + width < 0 ||
      y + height < 0 ||
      x - width > world.width ||
      y - height > world.height
    );
  }

  /**
   * Returns true if x and y are NOT NaN and the spawnClock has finished
   */
  protected get isReady(): boolean {
    return this.hasPosition && !this.spawnClock.pending;
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
