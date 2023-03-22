import { GameState } from "@/common/meta";
import { GameObject } from "@/objects";

export type SpawnFn = () => GameObject;

export type LevelStage = {
  time: number;
  maxAmount: number;
  intervalBetween: number;
  spawnables: SpawnFn[];
};

export interface Level {
  images?: string[];
  audios?: string[];
  update(state: GameState): GameObject[];
  init(): void;
}
