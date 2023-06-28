import { $ } from "@/core/dom";
import { throttle } from "@/core/util";

type Stats = { fps: string; frameTime: string };

let last = "0";
const memo: Record<string, Stats> = {};

function update(delta: number) {
  const oneRight = delta.toFixed(1);
  if (last === oneRight) return;
  last = oneRight;

  let stats: Stats = { fps: "0", frameTime: "0" };
  if (oneRight in memo) {
    stats = memo[oneRight];
  } else {
    stats = {
      fps: (1000 / delta).toFixed(0),
      frameTime: oneRight,
    };
    memo[oneRight] = stats;
  }
  $("#fps").textContent = stats.fps;
  $("#frameTime").textContent = stats.frameTime;
}

export const showStats = throttle(update);
