import { Drawable } from "@/common/meta";

export type Step = {
  (): Drawable[];
};

export interface Level {
  steps: Step[];
  images?: string[];
  audios?: string[];
}
