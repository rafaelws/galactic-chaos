import { Boundaries, Point } from "@/common/meta";

export interface ExplosionParticleParams {
  center: Point;
  angle: number;
  color: string;
  boundaries: Boundaries;
}
