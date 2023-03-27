import { assets, getImage, preloadAudio, preloadImages } from "@/common/asset";
import { p } from "@/common/meta";
import { AudioManager } from "@/main/AudioManager";
import { GameObject, healItem, Rock } from "@/objects";
import { linear } from "@/objects/shared";
import { firstWave } from "./firstWave";
import { fourthWave } from "./fourthWave";
import { secondWave } from "./secondWave";
import { thirdWave } from "./thirdWave";

const rocks = assets.img.rock.brown;
const ships = assets.img.ship.level1.slice(0, 2);

export type BrownRocks = typeof assets.img.rock.brown;
export type FirstLevelShips = typeof ships;

export async function firstLevel(): Promise<GameObject[]> {
  const themeSong = assets.audio.levels[0].theme;

  const images = [
    ...rocks,
    ...ships,
    assets.img.player.self,
    assets.img.player.items.heal,
    assets.img.player.damage[0],
    assets.img.player.damage[1],
    assets.img.player.damage[2],
  ];

  await Promise.all(preloadAudio([themeSong]));
  await Promise.all(preloadImages(images));

  AudioManager.play(themeSong);
  // nothing until 3.8
  // 20=change of pace
  // 30=intensity
  // 42=+intensity
  // 50=finish

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
