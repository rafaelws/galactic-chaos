import { Coordinate } from "@/common/meta";

export const MovementNature = {
  LINEAR: "LINEAR",
  // SIN: "SIN",
} as const;

type MovementNatureType = keyof typeof MovementNature;

export interface Step {
  position: Coordinate;

  /**
   * default=lerp, TODO=slerp, sin...
   * @default MovementNature.LINEAR
   */
  nature?: MovementNatureType;

  /**
   * Overall velocity increment rate
   * @default 0.1
   */
  speed?: number;
}

export interface MovementParams {
  steps: Step[];
  // repeatable?: boolean;
  // reverseable?: boolean;
}
