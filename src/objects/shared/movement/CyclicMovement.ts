import { Boundaries, Concrete, Coordinate } from "@/common/meta";
import { Cycle, CyclicMovementParams } from "./CyclicMovementParams";
import { MovementLegacy } from "./MovementLegacy";

export class CyclicMovement extends MovementLegacy {
  private trueStart: Coordinate;
  private cycle: Concrete<Cycle>;

  constructor(params?: CyclicMovementParams) {
    super(params);
    this.cycle = {
      increment: { x: 0, y: 0 },
      ...params?.cycle,
    };
    this.trueStart = this.movement.start;
  }

  private incremenetMovement() {
    return {
      x: this.movement.start.x + this.cycle.increment.x,
      y: this.movement.start.y + this.cycle.increment.y,
    };
  }

  public update(
    position: Coordinate,
    world: Boundaries,
    isOutbounds: boolean
  ): boolean {
    const reachedThreshold =
      position.y >= world.height || position.x >= world.width;

    if (reachedThreshold) {
      this.movement.start = isOutbounds
        ? this.trueStart
        : this.incremenetMovement();
    }

    return reachedThreshold;
  }
}
