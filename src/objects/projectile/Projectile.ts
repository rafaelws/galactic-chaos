import { Boundaries, Coordinate, GameState, HitBox } from "@/common/meta";
import { Effect, GameObject } from "../shared";
import { ProjectileParams } from "./ProjectileParams";

export class Projectile extends GameObject {
  private direction: Coordinate = { x: 0, y: 0 };

  constructor(private readonly params: ProjectileParams) {
    super(params);
    this.direction.x = Math.sin(-params.angle);
    this.direction.y = Math.cos(-params.angle);
  }

  public get hitbox(): HitBox {
    // palliative
    // TODO draw a circle/arc at the point of the angle
    return {
      ...super.hitbox,
      radius: this.cy * 0.5,
    };
  }

  protected startPoint(worldBoundaries: Boundaries): Coordinate {
    // TODO
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
    c.fillStyle = this.params.enemy ? "red" : "blue";
    c.fillRect(-this.cx, -this.cy, this.width, this.height);
    c.restore();
    if (this.debug) this.drawDebug(c);
  }
}
