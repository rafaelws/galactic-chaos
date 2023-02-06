import { GameManager } from "./GameManager";

export function setup() {
  let lts = 0;
  let delta = 0;
  let raf: number;
  let manager: GameManager;

  return {
    start() {
      manager = new GameManager();

      function loop(ts: DOMHighResTimeStamp) {
        delta = ts - lts;
        lts = ts;

        if (delta > 0) manager.nextFrame(delta);

        raf = requestAnimationFrame(loop);
      }

      loop(0);
    },
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      manager?.destroy();
    },
  };
}
