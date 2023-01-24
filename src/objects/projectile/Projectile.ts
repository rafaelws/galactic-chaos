import { trigger } from "@/common/events";
import { hasCollided } from "@/common/math";
import {
  Boundaries,
  Coordinate,
  Drawable,
  GameState,
  HitBox,
} from "@/common/meta";

export interface ProjectileParams {
  from: Coordinate;
  angle: number;
  enemy: boolean;
}

export class Projectile implements Drawable {
  private x = NaN;
  private y = NaN;
  private cx = 0;
  private cy = 0;
  private xDirection = 0;
  private yDirection = 0;

  private width = 0;
  private height = 0;
  private active = true;

  constructor(private readonly params: ProjectileParams) {
    this.xDirection = Math.sin(-params.angle);
    this.yDirection = Math.cos(-params.angle);
  }

  private setStartingPoint(worldBoundaries: Boundaries) {
    // TODO handle screen resize
    this.width = worldBoundaries.width * 0.0025;
    this.height = worldBoundaries.height * 0.05;

    this.cx = this.width * 0.5;
    this.cy = this.height * 0.5;

    this.x = this.params.from.x - this.cx;
    this.y = this.params.from.y - this.cy;
  }

  private move(state: GameState) {
    this.x = this.x - this.xDirection * state.delta;
    this.y = this.y - this.yDirection * state.delta;
  }

  public update(state: GameState) {
    if (isNaN(this.x) && isNaN(this.y))
      this.setStartingPoint(state.worldBoundaries);

    this.move(state);
    this.checkBoundaries(state.worldBoundaries);
    this.checkCollision(state.player);
  }

  public draw(c: CanvasRenderingContext2D) {
    if (!this.active) return;

    const { cx, cy } = this;
    c.save();
    c.translate(this.x + cx, this.y + cy);
    c.rotate(this.params.angle);
    c.fillStyle = "blue";
    c.fillRect(-cx, -cy, this.width, this.height);
    c.restore();
  }

  private checkBoundaries(worldBoundaries: Boundaries) {
    if (
      this.x + this.width < 0 ||
      this.y + this.height < 0 ||
      this.x - this.width > worldBoundaries.width ||
      this.y - this.height > worldBoundaries.height
    ) {
      this.active = false;
    }
  }

  private checkCollision(player: HitBox) {
    if (this.active && this.params.enemy && hasCollided(this.hitbox, player)) {
      // TODO
      trigger("impact", 1);
    }
  }

  public get isActive() {
    return this.active;
  }

  public get hitbox() {
    return { radius: this.cy, x: this.x + this.cx, y: this.y + this.cy };
  }
}
