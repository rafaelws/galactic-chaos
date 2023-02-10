import { Coordinate } from "@/common/meta";
import { ExplosionProfileName } from "./profiles";

export interface ExplosionParams {
  epicenter: Coordinate;
  howManyParticles?: number;
  profile: ExplosionProfileName;
}
