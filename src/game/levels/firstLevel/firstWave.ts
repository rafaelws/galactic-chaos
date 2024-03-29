import { getImage } from "@/core/asset";
import { p } from "@/core/meta";
import { Rock } from "@/core/objects";
import { linear } from "@/core/objects/shared";

import { BrownRocks } from ".";

export function firstWave(rocks: BrownRocks) {
  return [
    new Rock({
      spawnTimeout: 3.7 * 1000,
      img: getImage(rocks[9]),
      movement: linear(p(0.15, 0), p(0.85, 1)),
    }),

    new Rock({
      spawnTimeout: 5.6 * 1000,
      img: getImage(rocks[7]),
      movement: linear(p(0.85, 0), p(0.15, 1)),
    }),

    new Rock({
      spawnTimeout: 6.65 * 1000,
      img: getImage(rocks[8]),
      movement: linear(p(1, 0.65), p(0, 1)),
    }),

    new Rock({
      spawnTimeout: 7.7 * 1000,
      img: getImage(rocks[9]),
      movement: linear(p(0, 0.15), p(1, 0.8)),
    }),

    new Rock({
      spawnTimeout: 8.7 * 1000,
      img: getImage(rocks[6]),
      movement: linear(p(1, 0.68), p(0, 0.2)),
    }),
  ];
}
