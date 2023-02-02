import { Clock } from "@/common";
import { trigger } from "@/common/events";
import { atan2, R180, randInRange, toRad } from "@/common/math";
import { Concrete, Coordinate, GameState } from "@/common/meta";
import { GameEvent, Projectile } from "@/objects";
import { FireParams } from "./FireParams";

export class Fire {
  private fire: Concrete<FireParams>;
  private fireClock: Clock;

  constructor(params?: FireParams) {
    this.fire = {
      rate: 0,
      power: 1,
      precision: "SIMPLE",
      ...params,
      angle: params?.angle ? toRad(params.angle) : R180,
    };

    this.fireClock = new Clock(this.fire.rate, true);
  }

  private shoot(center: Coordinate, rotation: number): void {
    let angle = 0;

    if (this.fire.precision === "ACCURATE") {
      angle = rotation;
    } else if (this.fire.precision === "LOOSE") {
      angle = rotation + randInRange(-0.25, 0.25);
    } else {
      // SIMPLE
      angle = this.fire.angle;
    }

    trigger(
      GameEvent.spawn,
      new Projectile({
        enemy: true,
        angle,
        start: center,
        power: this.fire.power,
      })
    );
  }

  private getRotation(from: Coordinate, player: Coordinate): number {
    if (this.fire.rate === 0) return R180;

    return this.fire.precision === "SIMPLE"
      ? this.fire.angle
      : -atan2(from, player);
  }

  /**
   * @param center - Coordinate (`x + cx, y + cy`), HitBox (gameObject.hitbox)
   * @param state - GameState
   * @returns rotation
   */
  public update(center: Coordinate, state: GameState): number {
    const rotation = this.getRotation(center, state.player);

    if (this.fire.rate === 0) return rotation;
    if (this.fireClock.pending) {
      this.fireClock.increment(state.delta);
    } else {
      this.shoot(center, rotation);
      this.fireClock.reset();
    }
    return rotation;
  }
}
