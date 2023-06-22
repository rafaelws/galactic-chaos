import { audio } from "./audioDescriptor";
import { img } from "./imageDescriptor";

export const assets = {
  img,
  audio,
  common: {
    img: [img.player.self, img.player.items.heal, ...img.player.damage],
  },
} as const;

export * from "./audioLoader";
export * from "./audioManager";
export * from "./imageLoader";
