import { GameObject } from "@/common/meta";

export type Step = {
  (): GameObject[];
};

export interface Level {
  steps: Step[];
  images?: string[];
  audios?: string[];
}
