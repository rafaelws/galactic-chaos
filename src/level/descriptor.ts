import { assets, getImage } from "@/common/asset";
import { Player, Rock } from "@/objects";
import { Level } from "./Level";

// TODO break this file into level1/firstStep.ts
// TODO receive parameters (loaded assets*?) for each step function?
function firstStep() {
  const rock3 = getImage(assets.img.rock.brown[6]);
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

function secondStep() {
  return [];
}

function thirdStep() {
  return [];
}

function boss() {
  return [];
}

export const levels: Level[] = [
  {
    images: [
      assets.img.player.self,
      assets.img.rock.brown[3],
      assets.img.rock.brown[4],
      assets.img.rock.brown[5],
      assets.img.rock.brown[6],
      assets.img.ship.level1[0],
      assets.img.ship.level1[1],
      assets.img.ship.level1[2],
    ],
    steps: [firstStep, secondStep, thirdStep, boss],
  },
];
