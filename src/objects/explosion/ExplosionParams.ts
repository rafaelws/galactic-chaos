import { Point } from "@/common/meta";
import { ExplosionProfileName } from "./profiles";

export interface ExplosionParams {
  center: Point;
  howManyParticles?: number;
  profile: ExplosionProfileName;
}
