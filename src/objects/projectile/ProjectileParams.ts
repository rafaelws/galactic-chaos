import { GameObjectParams } from "../shared";

// remember to populate impact with, at least, power
export interface ProjectileParams extends GameObjectParams {
  enemy: boolean;
}
