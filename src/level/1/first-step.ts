import { assets, getImage } from "@/common/asset";
import { Rock, Ship } from "@/objects";

export function firstStep() {
  const rock3 = getImage(assets.img.rock.brown[3]);
  return [
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
    new Ship({
      img: getImage(assets.img.ship.level1[0]),
      movement: {
        angle: 60,
        start: { x: 0.5, y: 0 },
        speed: 0.2,
      },
      fire: {
        rate: 350,
      },
    }),
  ];
}
