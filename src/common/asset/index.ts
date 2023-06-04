export * from "./imageLoader";
export * from "./audioLoader";
export * from "./audioManager";
import { img } from "./imageDescriptor";
import { audio } from "./audioDescriptor";

export const assets = {
  img,
  audio,
  common: {
    img: [img.player.self, img.player.items.heal, ...img.player.damage],
  },
} as const;
