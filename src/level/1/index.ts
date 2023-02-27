import { assets } from "@/common/asset";
import { Level } from "../Level";
import { firstStep } from "./first-step";
import { secondStep } from "./second-step";

// TODO review imported assets
export const firstLevel: Level = {
  steps: [firstStep, secondStep],
  images: [
    assets.img.player.self,
    assets.img.player.items.heal,
    assets.img.player.damage[0],
    assets.img.player.damage[1],
    assets.img.player.damage[2],
    assets.img.rock.brown[0],
    assets.img.rock.brown[1],
    assets.img.rock.brown[2],
    assets.img.rock.brown[3],
    assets.img.rock.brown[4],
    assets.img.rock.brown[5],
    assets.img.rock.brown[6],
    assets.img.rock.brown[7],
    assets.img.rock.brown[8],
    assets.img.rock.brown[9],
    assets.img.ship.level1[0],
    assets.img.ship.level1[1],
    assets.img.ship.level1[2],
  ],
  audios: [assets.audio.levels[0].theme, assets.audio.levels[0].boss],
};
