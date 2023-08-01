import { getImage } from "@/core/asset";
import { dice, riir, rir } from "@/core/math";
import { p } from "@/core/meta";
import { Rock } from "@/core/objects";
import { linear } from "@/core/objects/shared";

import { BrownRocks } from ".";

export function thirdWave(rocks: BrownRocks) {
  const objects = [];
  const timeRange = [20 * 1000, 25 * 1000];

  for (let i = 0; i < 25; i++) {
    const roll = dice();

    objects.push(
      new Rock({
        spawnTimeout: rir(timeRange[0], timeRange[1]),
        rotationSpeed: rir(-3, 2),
        img: getImage(rocks[riir(0, 5)]),
        movement: linear(p(rir(0, 1), 0), p(rir(0, 1), 1), riir(0.5, 1)),
      }),
      new Rock({
        spawnTimeout: rir(timeRange[0], timeRange[1]),
        rotationSpeed: rir(-3, 2),
        img: getImage(rocks[riir(0, 5)]),
        movement: linear(
          p(roll ? 1 : 0, rir(0, 1)),
          p(roll ? 0 : 1, rir(0, 1)),
          rir(0.5, 1)
        ),
      }),
      new Rock({
        spawnTimeout: rir(timeRange[0], timeRange[1]),
        rotationSpeed: rir(-5, 6),
        img: getImage(rocks[riir(0, 5)]),
        movement: linear(
          p(roll ? 1 : 0, rir(0, 1)),
          p(roll ? 0 : 1, rir(0, 1)),
          rir(0.5, 1)
        ),
      }),
      new Rock({
        spawnTimeout: rir(timeRange[0], timeRange[1]),
        rotationSpeed: rir(-5, 6),
        img: getImage(rocks[riir(0, 5)]),
        movement: linear(
          p(rir(0, 1), roll ? 1 : 0),
          p(rir(0, 1), roll ? 0 : 1),
          rir(0.5, 1)
        ),
      })
    );
  }
  return objects;
}
