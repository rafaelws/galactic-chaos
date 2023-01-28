import { trigger } from "@/common/events";
import { hasCollided } from "@/common/math";
import { Boundaries, GameState, HitBox } from "@/common/meta";
import { GameObject, GameObjectParams } from "../shared";

export interface ProjectileParams extends GameObjectParams {
  enemy: boolean;
  power?: number;
}

export class Projectile extends GameObject {
  private power: number;

  constructor(private readonly params: ProjectileParams) {
    super(params);

    this.power = params.power || 1;
    this.direction.x = Math.sin(-this.movement.angle);
    this.direction.y = Math.cos(-this.movement.angle);
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
    /*
    // TODO test this
    this.x += this.direction.x * this.movement.speed * state.delta;
    this.y += this.direction.y * this.movement.speed * state.delta;
    */
    this.x -= this.direction.x * state.delta;
    this.y -= this.direction.y * state.delta;
  }

  protected checkCollision(player: HitBox) {
    if (this.active && this.params.enemy && hasCollided(this.hitbox, player)) {
      trigger("impact", this.power);
      this.active = false;
    }
  }

  // will never happen for Enemy Projectile
  public handleHit(_: number) {
    this.active = false;
  }

  public update(state: GameState) {
    super.update(state);
    if (!this.active) return;

    this.move(state);

    if (this.isOutbounds(state.worldBoundaries)) this.active = false;
    this.checkCollision(state.player);
  }

  public draw(c: CanvasRenderingContext2D) {
    if (!this.active || !this.ready) return;

    const { x, y, cx, cy, width, height } = this;

    c.save();
    c.translate(x + cx, y + cy);
    c.rotate(this.movement.angle);
    c.fillStyle = this.params.enemy ? "red" : "blue";
    c.fillRect(-cx, -cy, width, height);
    c.restore();

    if (this.debug) this.drawDebug(c);
  }
}
