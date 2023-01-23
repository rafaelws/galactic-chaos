import { ControlState } from "@/common/controls";
import { Boundaries, Coordinate, Drawable, GameState } from "@/common/meta";

export class Projectile implements Drawable {
  private x = 0;
  private y = 0;
  private xDirection = 0;
  private yDirection = 0;
  private cx = 0;
  private cy = 0;

  private width = 0;
  private height = 0;
  private active = true;

  constructor(
    from: Coordinate,
    private readonly angle: number,
    worldBoundaries: Boundaries
  ) {
    const { width, height } = worldBoundaries;

    // TODO handle screen resize
    this.width = width * 0.0025;
    this.height = height * 0.05;

    this.x = from.x - this.width * 0.5;
    this.y = from.y - this.height * 0.5;

    this.xDirection = Math.sin(-this.angle);
    this.yDirection = Math.cos(-this.angle);

    this.cx = this.width * 0.5;
    this.cy = this.height * 0.5;
  }

  public update(state: GameState, _: ControlState) {
    this.x = this.x - this.xDirection * state.delta;
    this.y = this.y - this.yDirection * state.delta;

    // 1. Out of Bounds
    if (
      this.x + this.width < 0 ||
      this.y + this.height < 0 ||
      this.x - this.width > state.worldBoundaries.width ||
      this.y - this.height > state.worldBoundaries.height
    ) {
      this.active = false;
    }
  }

  public draw(c: CanvasRenderingContext2D) {
    if (!this.active) return;

    const { cx, cy } = this;
    c.save();
    c.translate(this.x + cx, this.y + cy);
    c.rotate(this.angle);
    c.fillStyle = "blue";
    c.fillRect(-cx, -cy, this.width, this.height);
    c.restore();
  }

  public isActive() {
    return this.active;
  }
}
