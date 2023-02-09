import { Boundaries, Coordinate } from "@/common/meta";

export interface ExplosionParticleParams {
  epicenter: Coordinate;
  angle: number;
  color: string;
  boundaries: Boundaries;
}
