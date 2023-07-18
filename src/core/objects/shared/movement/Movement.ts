import { plerp, pmtpn, psi, psum, PZero } from "@/core/math";
import { Boundaries, Concrete, Point } from "@/core/meta";

import { FluentMovement } from "./FluentMovement";
import { MovementNature, MovementParams, MovementStep } from "./MovementParams";

const zeroedPoints = {
  p0: PZero,
  p1: PZero,
  p2: PZero,
  p3: PZero,
};

interface PointCache {
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
}

type CubicBezierCoefficientCache = {
  a: Point;
  b: Point;
  c: Point;
};

export class Movement {
  private readonly stepDefaults: Concrete<MovementStep> = {
    nature: MovementNature.Linear,
    speed: 1,
    ...zeroedPoints,
  };

  private steps: MovementStep[];
  private stepIndex = -1;

  private current: Concrete<MovementStep> | null = null;
  private deltaSum = 0;

  private pointCache: PointCache = zeroedPoints;
  private cubicCache: CubicBezierCoefficientCache | null = null;

  private repeatable: boolean;
  private hasEnded = false;

  constructor(
    private readonly delta: number,
    private readonly world: Boundaries,
    private readonly object: Boundaries,
    params: MovementParams | FluentMovement
  ) {
    params = params instanceof FluentMovement ? params.get() : params;

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
    if (current) {
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

      this.pointCache.p0 = this.offset(this.current.p0, this.pointCache.p0);

      if (this.current.nature === MovementNature.Linear) {
        this.pointCache.p1 = this.offset(this.current.p1, this.pointCache.p1);
      } else if (this.current.nature === MovementNature.QuadraticBezier) {
        this.pointCache.p2 = this.offset(this.current.p2, this.pointCache.p2);
      } else {
        this.pointCache.p3 = this.offset(this.current.p3, this.pointCache.p3);
      }
    }
  }

  public offset(relative: Point, absolute: Point) {
    const { width, height } = this.object;
    let x = absolute.x;
    let y = absolute.y;
    if (relative.x <= 0) x -= width;
    if (relative.y <= 0) y -= height;
    if (relative.x >= 1) x += width;
    if (relative.y >= 1) y += height;
    return { x, y };
  }

  public startPosition(): Point {
    return this.pointCache.p0;
  }

  private worldPosition(target: Point = PZero) {
    return { x: target.x * this.world.width, y: target.y * this.world.height };
  }

  private t() {
    this.deltaSum += this.delta;
    return this.deltaSum * 0.0001 * (this.current?.speed || 1);
  }

  private linear(t: number) {
    return plerp(this.pointCache.p0, this.pointCache.p1, t);
  }

  private quadraticBezier(t: number) {
    const { p0, p1, p2 } = this.pointCache;
    const q0 = plerp(p0, p1, t);
    const q1 = plerp(p1, p2, t);
    return plerp(q0, q1, t);
  }

  private cubicBezier(t: number) {
    const { p0, p1, p2, p3 } = this.pointCache;

    if (this.cubicCache === null) {
      const p0m3 = pmtpn(p0, 3);
      const p1m3 = pmtpn(p1, 3);
      const p2m3 = pmtpn(p2, 3);

      this.cubicCache = {
        a: psum(psi(p0m3), p1m3),
        b: psum(p0m3, pmtpn(p1, -6), p2m3),
        c: psum(psi(p0), p1m3, psi(p2m3), p3),
      };
    }

    const quad = t * t;
    return psum(
      p0,
      pmtpn(this.cubicCache.a, t),
      pmtpn(this.cubicCache.b, quad),
      pmtpn(this.cubicCache.c, quad * t)
    );
  }

  public update(): Point {
    const t = this.t();
    let c: Point = PZero;

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
