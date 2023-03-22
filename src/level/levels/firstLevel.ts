import { assets, getImage, preloadAudio, preloadImages } from "@/common/asset";
import { p } from "@/common/meta";
import { AudioManager } from "@/main/AudioManager";
import { GameObject, Rock } from "@/objects";
import { FluentMovement } from "@/objects/shared";

export async function firstLevel(): Promise<GameObject[]> {
  let objects: GameObject[] = [];

  const themeSong = assets.audio.levels[0].theme;
  const rocks = assets.img.rock.brown;
  const images = [
    ...rocks,
    assets.img.player.self,
    assets.img.player.items.heal,
    assets.img.player.damage[0],
    assets.img.player.damage[1],
    assets.img.player.damage[2],
    assets.img.ship.level1[0],
    assets.img.ship.level1[1],
  ];

  await Promise.all(preloadAudio([themeSong]));
  await Promise.all(preloadImages(images));

  AudioManager.play(themeSong);
  // nothing until 3.8
  // 20 (change of pace)=19
  // 30 (intensity)=29
  // 42 (+intensity)=41
  // 50=finish
  let time = 3.8 * 1000;

  const max = 10;
  for (let i = 1; i < max; i++) {
    objects.push(
      new Rock({
        spawnTimeout: time,
        rotationSpeed: i,
        img: getImage(rocks[0]),
        movement: new FluentMovement()
          .linear(p(i * 0.1, 0), p((max - i) * 0.1, 1))
          .get(),
      })
    );
  }

  return objects;
}
