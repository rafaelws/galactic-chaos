import { assets } from "@/common/asset";
import { Level } from "../Level";
import { firstStep } from "./first-step";

export const firstLevel: Level = {
  steps: [firstStep],
  images: [
    assets.img.player.self,
    assets.img.player.items.heal,
    assets.img.player.items.shield,
    assets.img.player.items.special,
    assets.img.player.damage[0],
    assets.img.player.damage[1],
    assets.img.player.damage[2],
    assets.img.rock.brown[3],
    assets.img.ship.level1[0],
    assets.img.ship.level1[1],
  ],
};
