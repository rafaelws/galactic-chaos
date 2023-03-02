import { Coordinate } from "@/common/meta";

export const MovementNature = {
  LINEAR: "LINEAR",
  COS: "COS",
  SIN: "SIN",
  // ARC: "ARC", // * can be done with cos or sin
} as const;

type MovementNatureType = keyof typeof MovementNature;

export interface Cycle {
  where: Coordinate;

  /**
   * @default 'LINEAR'
   */
  nature?: MovementNatureType;

  /**
   * Overall velocity increment rate
   * @default 0.1
   */
  speed?: number | Coordinate;
}

export interface MovementParams {
  cycles: Cycle[];
  repeatable?: boolean;
  reverseable?: boolean;
}
