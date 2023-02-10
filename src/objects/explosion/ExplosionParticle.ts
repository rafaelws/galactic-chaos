import { Clock } from "@/common";
import { Coordinate, Drawable, GameState } from "@/common/meta";
import { ExplosionParticleParams } from "./ExplosionParticleParams";

export class ExplosionParticle implements Drawable {
  private x: number;
  private y: number;
  private cx: number;
  private cy: number;
  private direction: Coordinate;
  private alpha: number = 1;
  private alphaClock: Clock;
  private active = true;

  constructor(private params: ExplosionParticleParams) {
    this.x = params.epicenter.x;
    this.y = params.epicenter.y;
    this.cx = params.boundaries.width * 0.5;
    this.cy = params.boundaries.height * 0.5;

    // the animation changes with a negative angle
    this.direction = {
      x: Math.sin(params.angle),
      y: Math.cos(params.angle),
    };

    // TODO change color?
    this.alphaClock = new Clock(50);
  }

  public get isActive() {
    return this.active;
  }

  public update(state: GameState): void {
    if (!this.alphaClock.pending) {
      this.alpha -= 0.05;
      this.alphaClock.reset();
    }
    this.alphaClock.increment(state.delta);

    if (this.alpha <= 0) {
      this.active = false;
      return;
    }

    this.x += this.direction.x * state.delta;
    this.y += this.direction.y * state.delta;
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (!this.active) return;
    c.save();
    c.translate(this.x + this.cx, this.y + this.cy);
    c.rotate(this.params.angle);
    c.fillStyle = this.params.color;
    c.globalAlpha = this.alpha;
    c.fillRect(
      -this.cx,
      -this.cy,
      this.params.boundaries.width,
      this.params.boundaries.height
    );
    c.restore();
  }
}
