import { Point } from "@/core/meta";

import { ExplosionProfileName } from "./profiles";

export interface ExplosionParams {
  center: Point;
  howManyParticles?: number;
  profile: ExplosionProfileName;
}
