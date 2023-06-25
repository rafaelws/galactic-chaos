import { raf } from "@/core/dom";

import { GameManager } from "./GameManager";

export function setup() {
  let stop: (() => void) | null = null;
  let manager: GameManager | null = null;

  return {
    start() {
      manager = new GameManager();
      stop = raf((delta) => manager?.nextFrame(delta));
    },
    destroy() {
      if (stop) stop();
      manager?.destroy();

      stop = null;
      manager = null;
    },
  };
}
