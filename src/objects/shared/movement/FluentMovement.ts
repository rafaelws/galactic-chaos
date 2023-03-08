import { Coordinate } from "@/common/meta";
import { MovementNature, MovementParams } from "./MovementParams";

export class FluentMovement {
  private params: MovementParams = {
    steps: [],
  };

  public linear(p0: Coordinate, p1: Coordinate, speed?: number) {
    this.params.steps.push({
      nature: MovementNature.Linear,
      p0: p0,
      p1: p1,
      speed,
    });
    return this;
  }

  public quadraticBezier(
    p0: Coordinate,
    p1: Coordinate,
    p2: Coordinate,
    speed?: number
  ) {
    this.params.steps.push({
      nature: MovementNature.QuadraticBezier,
      p0,
      p1,
      p2,
      speed,
    });
    return this;
  }

  public cubicBezier(
    p0: Coordinate,
    p1: Coordinate,
    p2: Coordinate,
    p3: Coordinate,
    speed?: number
  ) {
    this.params.steps.push({
      nature: MovementNature.CubicBezier,
      p0,
      p1,
      p2,
      p3,
      speed,
    });
    return this;
  }

  public repeatable(repeatable = true) {
    this.params.repeatable = repeatable;
    return this;
  }

  public get() {
    return this.params;
  }
}
