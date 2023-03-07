import { Clock } from "@/common";
import { lerp } from "@/common/math";
import { Drawable, GameState } from "@/common/meta";
import { StarParams } from "./StarParams";

export class Star implements Drawable {
  private active: boolean = true;

  private x: number;
  private y: number;
  private height: number;

  private alpha = 0.5;
  // private startAlpha = 0.5;
  private endAlpha = 0.5;
  private alphaClock: Clock;

  constructor(private params: StarParams) {
    this.x = params.position.x;
    this.y = params.position.y;
    this.height = params.radius * 2;
    this.y -= this.height;
    this.alphaClock = new Clock(params.glowSpeed || 1000);
  }

  public get isActive() {
    return this.active;
  }

  public update(state: GameState) {
    const delta = state.delta * 0.03;
    /*
    const accelerate =
      state.player.y > state.worldBoundaries.height * 0.75
        ? 0.5
        : state.player.y > state.worldBoundaries.height * 0.4
        ? 10
        : 50;

    if (accelerate !== this.acceleration) {
      this.acceleration = lerp(this.acceleration, accelerate, delta);
    }
    */

    this.y += delta * this.params.speed; // * this.acceleration
    this.active = this.y - this.height < state.worldBoundaries.height;

    // FIXME
    if (this.alphaClock.pending) {
      this.alphaClock.increment(state.delta);
    } else {
      this.endAlpha = this.endAlpha > 0.5 ? 0.5 : 1;
      this.alphaClock.reset();
    }

    if (this.alpha !== this.endAlpha) {
      this.alpha = lerp.i(this.alpha, this.endAlpha, state.delta * 0.01);
    }
  }

  public draw(c: CanvasRenderingContext2D): void {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.params.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.params.color;
    c.globalAlpha = this.alpha;
    c.fill();
    c.closePath();
    c.restore();
  }
}
