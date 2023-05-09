import { p } from "@/common/meta";
import { Rock } from "@/objects";
import { linear } from "@/objects/shared";
import { getImage } from "@/common/asset";
import { BrownRocks } from ".";

export function secondWave(rocks: BrownRocks) {
  return [
    new Rock({
      spawnTimeout: 11.766 * 1000,
      img: getImage(rocks[9]),
      movement: linear(p(0.85, 0), p(0.15, 1)),
    }),

    new Rock({
      spawnTimeout: 13.633 * 1000,
      img: getImage(rocks[7]),
      movement: linear(p(0.15, 0), p(0.85, 1)),
    }),

    new Rock({
      spawnTimeout: 14.65 * 1000,
      img: getImage(rocks[8]),
      movement: linear(p(0, 0.75), p(1, 1)),
    }),

    new Rock({
      spawnTimeout: 15.6 * 1000,
      img: getImage(rocks[9]),
      movement: linear(p(1, 0.68), p(0, 0.2)),
    }),

    new Rock({
      spawnTimeout: 16.8 * 1000,
      img: getImage(rocks[6]),
      movement: linear(p(0, 0.15), p(1, 0.8)),
    }),
  ];
}
