import { Boundaries, GameState, HitBox } from "@/common/meta";
import { GameObject } from "../shared";
import { ProjectileParams } from "./ProjectileParams";

export class Projectile extends GameObject {
  constructor(private readonly params: ProjectileParams) {
    super(params);
    this.direction.x = Math.sin(-this.movement.angle);
    this.direction.y = Math.cos(-this.movement.angle);
  }

  public get enemy() {
    return this.params.enemy;
  }

  public get hitbox(): HitBox {
    // palliative
    // TODO draw a circle/arc at the point of the angle
    return {
      ...super.hitbox,
      radius: this.cy * 0.5,
    };
  }

  protected setStartingPoint(worldBoundaries: Boundaries) {
    // TODO
    const width = worldBoundaries.width * 0.0025;
    const height = worldBoundaries.height * 0.05;
    this.setDimensions({ width, height });
    this.x = this.movement.start.x - this.cx;
    this.y = this.movement.start.y - this.cy;
  }

  protected move(state: GameState) {
    this.x -= this.direction.x * state.delta;
    this.y -= this.direction.y * state.delta;
  }

  public update(state: GameState) {
    super.update(state);
    if (!this.active) return;
    this.move(state);
    if (this.isOutbounds(state.worldBoundaries)) this.active = false;
  }

  public draw(c: CanvasRenderingContext2D) {
    if (!this.active || !this.ready) return;
    c.save();
    c.translate(this.x + this.cx, this.y + this.cy);
    c.rotate(this.movement.angle);
    c.fillStyle = this.params.enemy ? "red" : "blue";
    c.fillRect(-this.cx, -this.cy, this.width, this.height);
    c.restore();
    if (this.debug) this.drawDebug(c);
  }
}
