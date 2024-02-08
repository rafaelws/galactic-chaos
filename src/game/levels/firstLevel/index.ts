import { assets, getImage, preloadImages } from "@/core/asset";
import { events } from "@/core/events";
import { p } from "@/core/meta";
import { GameObject, healItem, Rock } from "@/core/objects";
import { linear } from "@/core/objects/shared";

import { firstWave } from "./firstWave";
import { fourthWave } from "./fourthWave";
import { secondWave } from "./secondWave";
import { thirdWave } from "./thirdWave";

const rocks = assets.img.rock.brown;
const ships = assets.img.ship.level1.slice(0, 2);

export type BrownRocks = typeof assets.img.rock.brown;
export type FirstLevelShips = typeof ships;

export async function firstLevel(): Promise<GameObject[]> {
  const { theme } = assets.audio.levels[0];

  await Promise.all(preloadImages(...assets.common.img, ...rocks, ...ships));
  events.audio.play({ track: theme });

  return [
    ...firstWave(rocks),
    ...secondWave(rocks),
    ...thirdWave(rocks),
    ...fourthWave(ships),

    new Rock({
      spawnTimeout: 55 * 1000,
      img: getImage(rocks[2]),
      movement: linear(p(0, 0), p(1, 1), 2),
      spawnables: [healItem(3)],
    }),
  ];
}
