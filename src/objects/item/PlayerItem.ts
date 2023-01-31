import { Clock } from "@/common";
import { Coordinate, GameState } from "@/common/meta";
import { GameObject } from "../shared";
import { Effect, PlayerItemParams } from "./PlayerItemParams";

export class PlayerItem extends GameObject {
  private timeoutClock: Clock;
  private frameClock: Clock;

  private showing = true;
  private targetTimeoutTime = 500; //ms

  private accelerated = false;
  private accelerateTimePast = 0;
  private accelerateTimeoutAt: number;

  constructor(private readonly params: PlayerItemParams) {
    super(params);

    this.hp = 1;
    this.impact.power = 0;

    this.frameClock = new Clock(this.targetTimeoutTime);
    this.timeoutClock = new Clock(params.timeout || 5000);
    this.accelerateTimeoutAt = this.timeoutClock.targetTime * 0.7;

    const { width, height } = this.params.img;
    this.setDimensions({ width, height });

    this.x = params.position?.x || 0;
    this.y = params.position?.y || 0;
  }

  public setPosition(position: Coordinate) {
    this.x = position.x;
    this.y = position.y;
  }

  public effect(): Effect | null {
    return this.params.effect;
  }

  public update(state: GameState): void {
    this.debug = state.debug;

    if (
      !this.accelerated &&
      this.accelerateTimePast >= this.accelerateTimeoutAt
    ) {
      this.frameClock.targetTime = this.targetTimeoutTime * 0.25;
      this.accelerated = true;
    } else {
      this.accelerateTimePast += state.delta;
    }

    this.timeoutClock.increment(state.delta);
    this.frameClock.increment(state.delta);
    if (!this.frameClock.pending) {
      this.showing = !this.showing;
      this.frameClock.reset();
    }
    if (!this.timeoutClock.pending) this.active = false;
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (!this.isReady || !this.showing) return;
    c.drawImage(this.params.img, this.x, this.y, this.width, this.height);
    if (this.debug) this.drawDebug(c);
  }
}
