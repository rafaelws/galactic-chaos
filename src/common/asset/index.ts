export * from "./loader";
import { img } from "./imageDescriptor";
import { audio } from "./audioDescriptor";

export const assets = {
  img,
  audio,
} as const;
