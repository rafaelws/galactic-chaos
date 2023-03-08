import { Clock } from "@/common";
import { trigger } from "@/common/events";
import { atan2, R180, randInRange, toRad } from "@/common/math";
import { Concrete, Coordinate, HitBox } from "@/common/meta";
import { GameEvent, Projectile } from "@/objects";
import { FireParams, FirePrecision } from "./FireParams";

export class Fire {
  private fire: Concrete<FireParams>;
  private fireClock: Clock;

  constructor(params?: FireParams) {
    this.fire = {
      rate: 0,
      power: 1,
      precision: FirePrecision.Simple,
      ...params,
      angle: params?.angle ? toRad(params.angle) : R180,
    };

    this.fireClock = new Clock(this.fire.rate, true);
  }

  private shoot(center: Coordinate, rotation: number): void {
    let angle = 0;

    if (this.fire.precision === FirePrecision.Accurate) {
      angle = rotation;
    } else if (this.fire.precision === FirePrecision.Loose) {
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
   * @param center gameObject.hitbox
   * @returns rotation
   */
  public update(delta: number, player: HitBox, center: Coordinate): number {
    const rotation = this.getRotation(center, player);

    if (this.fire.rate === 0) return rotation;
    if (this.fireClock.pending) {
      this.fireClock.increment(delta);
    } else {
      this.shoot(center, rotation);
      this.fireClock.reset();
    }
    return rotation;
  }
}
