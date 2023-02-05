import { toRad } from "@/common/math";
import { Boundaries, Concrete, Coordinate } from "@/common/meta";
import { MovementParams } from "./MovementParams";

export class Movement {
  protected movement: Concrete<MovementParams>;
  protected direction: Coordinate = { x: 0, y: 0 };

  constructor(params?: MovementParams) {
    this.movement = {
      start: { x: 0.5, y: 0 },
      angle: 0,
      speed: 0.1,
      ...params,
    };
  }

  /**
   * Calculates the position relative to the world boundaries.
   *
   * See `movement.start` on MovementParams.
   *
   * @param gameObject.dimensions
   * @param world - GameState.worldBoundaries
   * @returns startPosition (absolute x and y)
   */
  public startPosition(
    { width, height }: Boundaries,
    world: Boundaries
  ): Coordinate {
    const { angle, start } = this.movement;

    let x = 0;
    let y = 0;

    if (start.y > 0) {
      y = start.y * world.height;
      x = angle > 0 ? -width : world.width;
    } else {
      y = -height;
      x = start.x * world.width;
    }

    return { x, y };
  }

  public setDirection() {
    const angle = toRad(this.movement.angle);
    this.direction.x = Math.sin(angle);
    this.direction.y = Math.cos(angle);
  }

  public increment({ x, y }: Coordinate, delta: number): Coordinate {
    return {
      x: x + this.direction.x * this.movement.speed * delta,
      y: y + this.direction.y * this.movement.speed * delta,
    };
  }
}
