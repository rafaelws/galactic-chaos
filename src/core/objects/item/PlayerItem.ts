import { Clock } from "@/core";
import { GameObjectName } from "@/core/debug";
import { GameState, Point } from "@/core/meta";

import { Effect, GameObject } from "../shared";
import { PlayerItemParams } from "./PlayerItemParams";

export class PlayerItem extends GameObject {
  private timeoutClock: Clock;
  private frameClock: Clock;

  private showing = true;
  private targetTimeoutTime = 500; //ms

  private accelerated = false;
  private accelerateTimePast = 0;
  private accelerateTimeoutAt: number;

  constructor(private readonly params: PlayerItemParams) {
    super({ hp: 1 });

    this.frameClock = new Clock(this.targetTimeoutTime);
    this.timeoutClock = new Clock(params.timeout || 5000);
    this.accelerateTimeoutAt = this.timeoutClock.targetTime * 0.7;

    this.setDimensions(this.params.img);

    this.x = params.position?.x || 0;
    this.y = params.position?.y || 0;
  }

  public setPosition(position: Point) {
    this.x = position.x;
    this.y = position.y;
  }

  // TODO
  public handleEffect(_: Effect): void {
    this.active = false;
  }

  public effect(): Effect {
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
    c.drawImage(
      this.params.img,
      this.x - this.cx,
      this.y - this.cy,
      this.width,
      this.height
    );
    this.drawDebug(c, GameObjectName.PlayerItem);
  }
}
