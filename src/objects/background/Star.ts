import { Clock } from "@/common";
import { lerp } from "@/common/math";
import { Drawable, GameState } from "@/common/meta";
import { StarParams } from "./StarParams";

export class Star implements Drawable {
  private active: boolean = true;

  private x: number;
  private y: number;
  private height: number;

  private brightness = 0.5;
  private targetBrightness = 0.5;
  private brightnessClock: Clock;

  constructor(private params: StarParams) {
    this.x = params.position.x;
    this.y = params.position.y;
    this.height = params.radius * 2;
    this.y -= this.height;
    this.brightnessClock = new Clock(params.glowSpeed || 1000);
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

    this.brightnessClock.increment(state.delta);
    if (!this.brightnessClock.pending) {
      this.targetBrightness = this.targetBrightness > 0.5 ? 0.5 : 1;
      this.brightnessClock.reset();
    }

    if (this.brightness !== this.targetBrightness) {
      this.brightness = lerp(this.brightness, this.targetBrightness, 0.01);
      // this.brightness = this.targetBrightness;
    }
  }

  public draw(c: CanvasRenderingContext2D): void {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.params.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.params.color;
    // shadowBlur and filter harms performance
    // when having too many objects on screen
    // c.shadowColor = this.params.color;
    // c.shadowBlur = 5;
    // c.filter = `brightness(${this.brightness})`;
    c.globalAlpha = this.brightness;
    c.fill();
    c.closePath();
    c.restore();
  }
}
