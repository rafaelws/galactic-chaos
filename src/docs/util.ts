import { assets } from "@/core/asset";

type Assets = Record<string, string[]>;

export function getAssets(): Assets {
  return {
    Ship: [
      ...assets.img.ship.level1.slice(0, 2),
      ...assets.img.ship.level2.slice(0, 2),
      ...assets.img.ship.level3.slice(0, 2),
      ...assets.img.ship.level4.slice(0, 2),
    ],
    Rock: [
      ...assets.img.rock.brown,
      ...assets.img.rock.grey,
      ...assets.img.rock.giant,
    ],
    Boss: [
      assets.img.ship.level1[2],
      assets.img.ship.level2[2],
      assets.img.ship.level3[2],
      assets.img.ship.level4[2],
      assets.img.ship.final,
    ],
  };
}
