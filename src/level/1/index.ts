import { assets } from "@/common/asset";
import { Level } from "../Level";
import { firstStep } from "./first-step";

export const firstLevel: Level = {
  steps: [firstStep],
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
};
