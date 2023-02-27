export * from "./imageLoader";
export * from "./audioLoader";
import { img } from "./imageDescriptor";
import { audio } from "./audioDescriptor";

export const assets = {
  img,
  audio,
} as const;
