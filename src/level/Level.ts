import { GameObject } from "@/objects";

export type Step = {
  (): GameObject[];
};

export interface Level {
  steps: Step[];
  images?: string[];
  audios?: string[];
}
