import { off, on } from "@/common/events";
import { GameManager } from "./GameManager";

export function start() {
  let lts = 0;
  let delta = 0;
  let raf: number | undefined;

  const manager = new GameManager();

  function loop(ts: DOMHighResTimeStamp) {
    delta = ts - lts;
    lts = ts;

    if (delta > 0) manager.nextFrame(delta);

    raf = requestAnimationFrame(loop);
  }

  loop(0);

  function handleQuit() {
    off("quit", handleQuit);
    if (raf) cancelAnimationFrame(raf);
    manager.destroy();
  }

  on("quit", handleQuit);
}
