import { Clock } from "@/common";
import { Boundaries, Coordinate, GameState, HitBox } from "@/common/meta";
import { Effect, GameObject } from "../shared";
import { ProjectileParams } from "./ProjectileParams";

export class Projectile extends GameObject {
  private color: string;
  private brightness = 1;
  private brightnessClock: Clock;
  private direction: Coordinate = { x: 0, y: 0 };

  constructor(private readonly params: ProjectileParams) {
    super(params);
    this.direction.x = Math.sin(-params.angle);
    this.direction.y = Math.cos(-params.angle);
    this.color = params.color
      ? params.color
      : params.enemy
      ? "rgb(172, 57, 57)"
      : "rgb(48, 178, 233)";

    this.brightnessClock = new Clock(350);
  }

  public get hitbox(): HitBox {
    // palliative
    // FIXME should be a small arc at the very tip of the projectile
    return {
      ...super.hitbox,
      radius: this.cy * 0.5,
    };
  }

  protected startPoint(worldBoundaries: Boundaries): Coordinate {
    // TODO rethink dimensions
    const width = worldBoundaries.width * 0.0025;
    const height = worldBoundaries.height * 0.05;
    this.setDimensions({ width, height });
    return {
      x: this.params.start.x - this.cx,
      y: this.params.start.y - this.cy,
    };
  }

  private move(state: GameState) {
    this.x -= this.direction.x * state.delta;
    this.y -= this.direction.y * state.delta;
  }

  // TODO
  public handleEffect(effect: Effect): void {
    this.hpLoss(effect.amount);
  }

  public effect(): Effect {
    return {
      type: "PROJECTILE",
      amount: this.params.power,
    };
  }

  public update(state: GameState) {
    super.update(state);

    this.brightnessClock.increment(state.delta);
    if (!this.brightnessClock.pending) {
      this.brightness = this.brightness === 1 ? 2 : 1;
      this.brightnessClock.reset();
    }

    if (!this.hasPosition)
      this.position = this.startPoint(state.worldBoundaries);

    if (!this.active) return;

    this.move(state);

    if (this.isOutbounds(state.worldBoundaries, this.dimensions)) {
      this.active = false;
    }
  }

  public draw(c: CanvasRenderingContext2D) {
    if (!this.active || !this.isReady) return;
    c.save();
    c.translate(this.x + this.cx, this.y + this.cy);
    c.rotate(this.params.angle);
    c.fillStyle = this.color;
    // TODO if too many on screen, overall performance is harmed
    // TODO check if it works on safari/ios
    c.filter = `brightness(${this.brightness})`;
    c.fillRect(-this.cx, -this.cy, this.width, this.height);
    c.restore();
    if (this.debug) this.drawDebug(c);
  }
}
