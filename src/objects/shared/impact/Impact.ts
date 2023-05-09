import { Clock } from "@/common";
import { Concrete } from "@/common/meta";
import { ImpactParams } from "./ImpactParams";

export class Impact {
  private impact: Concrete<ImpactParams>;
  private impactClock: Clock;

  constructor(params?: ImpactParams) {
    this.impact = {
      power: 1,
      resistance: 0,
      collisionTimeout: 250,
      ...params,
    };

    this.impactClock = new Clock(this.impact.collisionTimeout, true);
  }

  public onImpact(): number {
    if (this.impactClock.pending) return 0;
    this.impactClock.reset();
    return this.impact.power;
  }

  public update(delta: number) {
    this.impactClock.increment(delta);
  }

  public get resistence() {
    return this.impact.resistance;
  }
}
