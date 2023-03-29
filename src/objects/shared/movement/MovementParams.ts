import { Point } from "@/common/meta";

export enum MovementNature {
  Linear = "Linear",
  QuadraticBezier = "QuadraticBezier",
  CubicBezier = "CubicBezier",
}

/**
 * Linear: requires p0 and p1
 * QuadraticBezier: requires p0, p1(pivot) and p2
 * CubicBezier: requires p0, p1(control point), p2(control point) and p3
 */
export interface MovementStep {
  nature: MovementNature;
  p0: Point;
  p1: Point;
  p2?: Point;
  p3?: Point;
  speed?: number;
}

export interface MovementParams {
  steps: MovementStep[];
  repeatable?: boolean;
}
