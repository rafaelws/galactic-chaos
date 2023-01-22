import { assets, getImage } from "@/common/asset";
import { Player } from "@/objects";
import { Level } from "./Level";

function firstStep() {
  return [new Player(getImage(assets.img.player.self))];
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
