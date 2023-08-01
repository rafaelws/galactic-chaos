import { Boundaries, Point } from "@/core/meta";

export interface ExplosionParticleParams {
  center: Point;
  angle: number;
  color: string;
  boundaries: Boundaries;
}
