import { coordinate } from "@/common/math";
import { Boundaries, Concrete, Coordinate } from "@/common/meta";
import { MovementNature, MovementParams, Step } from "./MovementParams";

type CubicBezierCoefficientCache = {
  a: Coordinate;
  b: Coordinate;
  c: Coordinate;
};

const zeroCoordinate = { x: 0, y: 0 } as const;
const zeroCoordinatePoints = {
  p0: zeroCoordinate,
  p1: zeroCoordinate,
  p2: zeroCoordinate,
  p3: zeroCoordinate,
};

interface PointCache {
  p0: Coordinate;
  p1: Coordinate;
  p2: Coordinate;
  p3: Coordinate;
}

export class Movement {
  private readonly stepDefaults: Concrete<Step> = {
    nature: MovementNature.Linear,
    speed: 0.1,
    ...zeroCoordinatePoints,
  };

  private steps: Step[];
  private stepIndex = -1;

  private current: Concrete<Step> | null = null;
  private deltaSum: number = 0;

  private pointCache: PointCache = zeroCoordinatePoints;
  private cubicCache: CubicBezierCoefficientCache | null = null;

  // TODO
  // private repeatable: boolean;
  // private reverseable: boolean;

  constructor(
    private readonly delta: number,
    private readonly world: Boundaries,
    private readonly object: Boundaries,
    params: MovementParams
  ) {
    this.steps = params.steps;
    // this.repeatable = params?.repeatable || false;
    // this.reverseable = params?.reverseable || false;
    this.step();
  }

  private step() {
    // TODO deal with prepeatable, reverseable
    ++this.stepIndex;
    this.current = null;

    const current = this.steps[this.stepIndex];
    if (!!current) {
      this.current = {
        ...this.stepDefaults,
        ...this.steps[this.stepIndex],
      };

      this.pointCache = {
        p0: this.worldPosition(this.current.p0),
        p1: this.worldPosition(this.current.p1),
        p2: this.worldPosition(this.current.p2),
        p3: this.worldPosition(this.current.p3),
      };
    }
  }

  public startPosition(): Coordinate {
    const start = this.current?.p0;
    let { x, y } = this.worldPosition(start);

    if (start?.x === 0) x -= this.object.width;
    if (start?.y === 0) y -= this.object.height;

    return { x, y };
  }

  private worldPosition(target: Coordinate = zeroCoordinate) {
    return { x: target.x * this.world.width, y: target.y * this.world.height };
  }

  private factor() {
    this.deltaSum += this.delta;
    return this.deltaSum * 0.0001 * (this.current?.speed || 1);
  }

  private linear(t: number) {
    return coordinate.lerp(this.pointCache.p0, this.pointCache.p1, t);
  }

  private quadraticBezier(t: number) {
    const { p0, p1, p2 } = this.pointCache;
    const q0 = coordinate.lerp(p0, p1, t);
    const q1 = coordinate.lerp(p1, p2, t);
    return coordinate.lerp(q0, q1, t);
  }

  private cubicBezier(t: number) {
    const { sum, mtpf, si } = coordinate;
    const { p0, p1, p2, p3 } = this.pointCache;

    if (this.cubicCache === null) {
      const p0m3 = mtpf(p0, 3);
      const p1m3 = mtpf(p1, 3);
      const p2m3 = mtpf(p2, 3);

      this.cubicCache = {
        a: sum(si(p0m3), p1m3),
        b: sum(p0m3, mtpf(p1, -6), p2m3),
        c: sum(si(p0), p1m3, si(p2m3), p3),
      };
    }

    const quad = t * t;
    return sum(
      p0,
      mtpf(this.cubicCache.a, t),
      mtpf(this.cubicCache.b, quad),
      mtpf(this.cubicCache.c, quad * t)
    );
  }

  public update(): Coordinate {
    const t = this.factor();
    let c: Coordinate = zeroCoordinate;

    console.log({ curr: this.pointCache });

    switch (this.current?.nature) {
      case MovementNature.Linear:
        c = this.linear(t);
        break;
      case MovementNature.QuadraticBezier:
        c = this.quadraticBezier(t);
        break;
      case MovementNature.CubicBezier:
        c = this.cubicBezier(t);
        break;
    }

    // next movement
    if (t >= 1) {
      this.cubicCache = null;
      this.deltaSum = 0;
      this.step();
    }
    return c;
  }
}
