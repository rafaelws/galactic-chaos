import { Point } from "@/common/meta";
import { ExplosionProfileName } from "./profiles";

export interface ExplosionParams {
  epicenter: Point;
  howManyParticles?: number;
  profile: ExplosionProfileName;
}
