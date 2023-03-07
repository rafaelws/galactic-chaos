import { coordinate } from "@/common/math";
import { Boundaries, Concrete, Coordinate } from "@/common/meta";
import { MovementNature, MovementParams, Step } from "./MovementParams";

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

type CubicBezierCoefficientCache = {
  a: Coordinate;
  b: Coordinate;
  c: Coordinate;
};

export class Movement {
  private readonly stepDefaults: Concrete<Step> = {
    nature: MovementNature.Linear,
    speed: 1,
    ...zeroCoordinatePoints,
  };

  private steps: Step[];
  private stepIndex = -1;

  private current: Concrete<Step> | null = null;
  private deltaSum: number = 0;

  private pointCache: PointCache = zeroCoordinatePoints;
  private cubicCache: CubicBezierCoefficientCache | null = null;

  private repeatable: boolean;
  private hasEnded = false;

  constructor(
    private readonly delta: number,
    private readonly world: Boundaries,
    private readonly object: Boundaries,
    params: MovementParams
  ) {
    this.steps = params.steps;
    this.repeatable = params?.repeatable || false;
    this.step();
  }

  private step(): void {
    ++this.stepIndex;
    this.current = null;

    if (this.stepIndex >= this.steps.length) {
      if (this.repeatable) {
        this.stepIndex = -1;
        return this.step();
      } else {
        this.hasEnded = true;
        return;
      }
    }

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

      // const { nature } = this.current;
      // this.pointCache.p0 = this.offsetZero(this.current.p0, this.pointCache.p0);
      /*
      if (nature === MovementNature.Linear) {
        this.pointCache.p1 = this.offset(this.current.p1, this.pointCache.p1);
      } else if (nature === MovementNature.QuadraticBezier) {
        this.pointCache.p2 = this.offset(this.current.p2, this.pointCache.p2);
      } else {
        this.pointCache.p3 = this.offset(this.current.p3, this.pointCache.p3);
      }
      */
    }
  }

  public offset(relative: Coordinate, absolute: Coordinate) {
    const { width, height } = this.object;
    let x = absolute.x;
    let y = absolute.y;
    if (relative.x <= 0) x -= width;
    if (relative.y <= 0) y -= height;
    if (relative.x >= 1) x += width;
    if (relative.y >= 1) y += height;
    return { x, y };
  }

  public startPosition(): Coordinate {
    /*
    const start = this.current?.p0;
    let { x, y } = this.worldPosition(start);

    if (start?.x === 0) x -= this.object.width;
    if (start?.y === 0) y -= this.object.height;

    return { x, y };
    */
    return this.pointCache.p0;
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

  public get ended() {
    return this.hasEnded;
  }
}
