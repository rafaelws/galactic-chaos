import { assets, getImage } from "@/common/asset";
import { Player, Rock } from "@/objects";

// TODO receive parameters (loaded assets*?) for each step function?
export function firstStep() {
  const rock3 = getImage(assets.img.rock.brown[3]);
  return [
    new Player(getImage(assets.img.player.self)),
    new Rock({
      img: rock3,
      start: { x: 0.5, y: 0.5 },
      angle: -60,
      delay: 1000,
      speed: 0.1,
      rotation: {
        direction: "COUNTERCLOCKWISE",
        speed: 5,
      },
    }),
    new Rock({
      img: rock3,
      start: { x: 0.5, y: 0 },
      angle: 60,
      delay: 2000,
      speed: 0.2,
      rotation: {
        direction: "CLOCKWISE",
        speed: 2,
      },
    }),
  ];
}
