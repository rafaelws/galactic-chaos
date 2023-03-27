import { assets, getImage, preloadAudio, preloadImages } from "@/common/asset";
import { p } from "@/common/meta";
import { AudioManager } from "@/main/AudioManager";
import { GameObject, healItem, Rock } from "@/objects";
import { linear } from "@/objects/shared";

type BrownRocks = typeof assets.img.rock.brown;

function firstWave(rocks: BrownRocks) {
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
      spawnTimeout: 6.45 * 1000,
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

function secondWave(rocks: BrownRocks) {
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
      spawnTimeout: 14.5 * 1000,
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

export async function firstLevel(): Promise<GameObject[]> {
  const themeSong = assets.audio.levels[0].theme;

  const rocks = assets.img.rock.brown;
  const ships = [assets.img.ship.level1[0], assets.img.ship.level1[1]];
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

    new Rock({
      spawnTimeout: 50 * 1000,
      img: getImage(rocks[2]),
      movement: linear(p(0, 0), p(1, 1), 2),
      spawnables: [healItem(3)],
    }),
  ];
}
