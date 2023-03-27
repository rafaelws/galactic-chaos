import { assets, getImage, preloadAudio, preloadImages } from "@/common/asset";
import { riir, rir } from "@/common/math";
import { p } from "@/common/meta";
import { AudioManager } from "@/main/AudioManager";
import { GameObject, healItem, Rock, Ship } from "@/objects";
import { cubicBezier, linear, quadraticBezier } from "@/objects/shared";

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
  let time = 3.75 * 1000;
  const firstStep = 20 * 1000;
  const secondStep = 30 * 1000;
  const thirdStep = 60 * 1000;

  return [
    new Rock({
      spawnTimeout: thirdStep,
      img: getImage(rocks[2]),
      movement: linear(p(0, 0), p(1, 1), 2).get(),
      spawnables: [healItem(3)],
    }),
  ];
}
