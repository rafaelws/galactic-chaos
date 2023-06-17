import { p } from "@/common/meta";
import {
  assets,
  audioManager,
  getImage,
  preloadAudio,
  preloadImages,
} from "@/common/asset";
import { Boss, GameObject, healItem, Ship } from "@/objects";
import { linear, quadraticBezier } from "@/objects/shared";
import { firstPhase } from "./firstPhase";
import { secondPhase } from "./secondPhase";
import { thirdPhase } from "./thirdPhase";

export async function firstBoss(): Promise<GameObject[]> {
  const ships = assets.img.ship.level1;
  const theme = assets.audio.levels[0].boss;

  await Promise.all([
    ...preloadImages(...ships, ...assets.common.img, ...assets.img.rock.brown),
    ...preloadAudio(theme),
  ]);
  await audioManager.play({ assetPath: theme });

  const boss = new Boss({
    spawnTimeout: 16.99 * 1000,
    hp: 30,
    phases: [firstPhase(), secondPhase(), thirdPhase()],
    img: getImage(ships[2]),
  });

  return [
    boss,
    new Ship({
      spawnTimeout: 3.5 * 1000,
      img: getImage(ships[0]),
      movement: linear(p(0, 0), p(1, 1), 2.5)
        .linear(p(1, 1), p(0, 0), 2.5)
        .repeatable(),
      spawnables: [healItem(3.3)],
    }),
    new Ship({
      spawnTimeout: 10 * 1000,
      img: getImage(ships[1]),
      movement: linear(p(1, 0), p(0, 1), 2)
        .linear(p(0, 1), p(1, 0), 2)
        .repeatable(),
      spawnables: [healItem(3.3)],
    }),
    new Ship({
      spawnTimeout: 6.8 * 1000,
      img: getImage(ships[1]),
      movement: quadraticBezier(p(0, 0), p(0.5, 1), p(1, 0), 3)
        .quadraticBezier(p(1, 0), p(0.5, 1), p(0, 0), 3)
        .repeatable(),
      spawnables: [healItem(3.3)],
    }),
  ];
}
