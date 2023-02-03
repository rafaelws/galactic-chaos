import {
  CyclicMovementParams,
  FireParams,
  GameObject,
  GameObjectParams,
  ImpactParams,
} from "../shared";

export type BossNextPhaseParams = {
  maxHp: number;
  hp: number;
};

export type BossNextPhaseFn = {
  (params: BossNextPhaseParams): boolean;
};

export type BossPhase = {
  nextPhaseCondition: BossNextPhaseFn;
  fire?: FireParams;
  cyclicMovement?: CyclicMovementParams;
  impact?: ImpactParams;
  spawnables?: GameObject[];
};

export interface BossParams extends GameObjectParams {
  img: HTMLImageElement;
  phases: BossPhase[];
}
