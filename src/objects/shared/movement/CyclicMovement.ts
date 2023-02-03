import { Boundaries, Concrete, Coordinate } from "@/common/meta";
import { Cycle, CyclicMovementParams } from "./CyclicMovementParams";
import { Movement } from "./Movement";

export class CyclicMovement extends Movement {
  private trueStart: Coordinate;
  private cycle: Concrete<Cycle>;

  constructor(params?: CyclicMovementParams) {
    super(params);
    this.cycle = {
      increment: { x: 0, y: 0 },
      // reverse: false,
      // threshold: { x: 0, y: 0 },
      ...params?.cycle,
    };
    this.trueStart = this.movement.start;
  }

  private reachedThreshold({ x, y }: Coordinate, world: Boundaries) {
    return y >= world.height || x >= world.width;
    /*
    return (
      y >= world.height * this.cycle.threshold.y &&
      x >= world.width * this.cycle.threshold.x
    );
    */
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
    if (this.reachedThreshold(position, world)) {
      // TODO reverse
      this.movement.start = isOutbounds
        ? this.trueStart
        : this.incremenetMovement();

      return true;
    }
    return false;
  }
}
