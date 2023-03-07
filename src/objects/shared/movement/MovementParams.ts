import { Coordinate } from "@/common/meta";

// TODO ParabolaMovement?

export enum MovementNature {
  Linear = "l",
  QuadraticBezier = "qb",
  CubicBezier = "cb",
}

/**
 * Linear: requires p0 and p1
 * QuadraticBezier: requires p0, p1(pivot) and p2
 * CubicBezier: requires p0, p1(control point), p2(control point) and p3
 */
export interface Step {
  nature: MovementNature;
  p0: Coordinate;
  p1: Coordinate;
  p2?: Coordinate;
  p3?: Coordinate;
  speed?: number;
}

export interface MovementParams {
  steps: Step[];
  repeatable?: boolean;
}
