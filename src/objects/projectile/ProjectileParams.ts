import { Point } from "@/common/meta";

export interface ProjectileParams {
  hp?: number;
  enemy: boolean;
  power: number;
  angle: number;
  start: Point;
  color?: string;
}
