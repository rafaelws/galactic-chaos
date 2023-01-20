import {
  Boundaries,
  ControlState,
  Coordinate,
  Drawable,
  GameState,
} from "@/common";

export class Projectile implements Drawable {
  private x: number = 0;
  private y: number = 0;
  private xDirection: number = 0;
  private yDirection: number = 0;

  private width: number = 0;
  private height: number = 0;
  private active = true;

  constructor(
    from: Coordinate,
    private readonly angle: number,
    worldBoundaries: Boundaries
  ) {
    const { width, height } = worldBoundaries;

    this.width = width * 0.0025;
    this.height = height * 0.05;

    this.x = from.x - this.width * 0.5;
    this.y = from.y - this.height * 0.5;

    this.xDirection = Math.sin(-this.angle);
    this.yDirection = Math.cos(-this.angle);
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

  public draw(c: CanvasRenderingContext2D, _: GameState) {
    if (!this.active) return;

    const cx = this.width * 0.5;
    const cy = this.height * 0.5;

    c.save();
    c.translate(this.x + cx, this.y + cy);
    c.rotate(this.angle);
    c.fillStyle = "red";
    c.fillRect(-cx, -cy, this.width, this.height);
    c.restore();
  }

  public get isActive() {
    return this.active;
  }
}
