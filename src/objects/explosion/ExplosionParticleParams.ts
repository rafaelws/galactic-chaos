import { Boundaries, Point } from "@/common/meta";

export interface ExplosionParticleParams {
  epicenter: Point;
  angle: number;
  color: string;
  boundaries: Boundaries;
}
