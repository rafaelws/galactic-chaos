import {
  FireParams,
  FluentMovement,
  GameObject,
  GameObjectParams,
  ImpactParams,
  MovementParams,
} from "../shared";

export type BossNextPhaseParams = {
  maxHp: number;
  hp: number;
};

export type BossNextPhaseFn = {
  (params: BossNextPhaseParams): boolean;
};

export type BossPhase = {
  movement: MovementParams | FluentMovement;
  fire?: FireParams;
  impact?: ImpactParams;
  spawnables?: GameObject[];
  nextPhaseCondition: BossNextPhaseFn;
};

export interface BossParams extends GameObjectParams {
  img: HTMLImageElement;
  phases: BossPhase[];
}
