import { p } from "@/common/meta";
import { assets, getImage, preloadAudio, preloadImages } from "@/common/asset";
import { AudioEvent } from "@/main/AudioManager";
import { GameObject, healItem, Rock } from "@/objects";
import { linear } from "@/objects/shared";
import { firstWave } from "./firstWave";
import { fourthWave } from "./fourthWave";
import { secondWave } from "./secondWave";
import { thirdWave } from "./thirdWave";
import { trigger } from "@/common/events";

const rocks = assets.img.rock.brown;
const ships = assets.img.ship.level1.slice(0, 2);

export type BrownRocks = typeof assets.img.rock.brown;
export type FirstLevelShips = typeof ships;

export async function firstLevel(): Promise<GameObject[]> {
  const { theme, boss } = assets.audio.levels[0];

  await Promise.all(preloadAudio(theme, boss));
  await Promise.all(
    preloadImages(
      ...assets.common.img,
      ...rocks,
      ...ships,
      assets.img.ship.level1[2]
    )
  );

  trigger(AudioEvent.Play, { assetPath: theme });

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
