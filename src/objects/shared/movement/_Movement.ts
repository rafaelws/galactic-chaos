import { atan2 } from "@/common/math";
import { Boundaries, Concrete, Coordinate } from "@/common/meta";
import { Cycle, MovementNature, MovementParams } from "./_MovementParams";

/**
sin and cos:
4 params
starting x or y
length
amplitude
frequency

uma coordenada se move de forma linear, e.g: x += delta * speed;
a outra coordenada: y += Math.sin/cos(x * length + frequency) * amplitude
 */

export class Movement {
  private cycles: Cycle[];
  private currentCycleIndex = -1;

  private current: Concrete<Cycle>;
  private speed: Coordinate = { x: 0, y: 0 };
  private next: Concrete<Cycle>;

  private repeatable: boolean;
  private reverseable: boolean;

  private direction: Coordinate = { x: 0, y: 0 };
  private angle: number = -1;

  constructor(params?: MovementParams) {
    this.cycles = params?.cycles || [];
    this.repeatable = params?.repeatable || false;
    this.reverseable = params?.reverseable || false;

    const [current, next] = this.proceed();
    this.current = current;
    this.next = next;
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
    let x = 0;
    let y = 0;
    const start = this.current.where;

    if (start.y > 0) {
      y = start.y * world.height;
      // x = angle > 0 ? -width : world.width;
      // TODO how to determine positive and negative?
      x = -width;
    } else {
      y = -height;
      x = start.x * world.width;
    }

    return { x, y };
  }

  public update(
    position: Coordinate,
    world: Boundaries,
    delta: number
  ): Coordinate {
    const x = position.x + this.direction.x * this.speed.x * delta;
    const y = position.y + this.direction.y * this.speed.y * delta;

    // TODO identify if it reached next cycle
    // TODO handle repeatable and reversable

    return { x, y };
  }

  private proceed() {
    ++this.currentCycleIndex;
    this.setSpeed();
    this.setDirection();
    // TODO determine from and to coordinates (previous and next cycle)

    // FIXME remove console.log, just
    if (this.currentCycleIndex >= this.cycles.length)
      console.log("currentIndex >= length");
    if (!this.hasNext()) console.log("there is no next cycle");

    return [
      this.getCycle(this.currentCycleIndex),
      this.getCycle(this.currentCycleIndex + 1),
    ];
  }

  private setSpeed() {
    const speed = this.current.speed;

    if (typeof speed === "number") {
      this.speed.x = speed;
      this.speed.y = speed;
    } else {
      this.speed.x = speed.x;
      this.speed.y = speed.y;
    }
  }

  private setDirection() {
    if (!this.hasNext()) return;

    // TODO how to determine positive and negative?
    this.angle = atan2(this.current.where, this.next.where);

    this.direction.x = Math.sin(this.angle);
    this.direction.y = Math.cos(this.angle);
  }

  private getCycle(index: number): Concrete<Cycle> {
    return {
      speed: 0.1,
      nature: MovementNature.LINEAR,
      ...this.cycles[index],
    };
  }

  private hasNext() {
    return this.currentCycleIndex + 1 >= this.cycles.length;
  }
}
