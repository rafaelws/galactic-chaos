import { assets, preloadImages } from "@/core/asset";

export const entityTypes = ["Rock", "Ship"] as const; // "Boss"
export type EntityType = (typeof entityTypes)[number];
export type Assets = Record<EntityType, HTMLImageElement[]>;

export async function loadAssets(): Promise<Assets> {
  const ships = [
    ...assets.img.ship.level1.slice(0, 2),
    ...assets.img.ship.level2.slice(0, 2),
    ...assets.img.ship.level3.slice(0, 2),
    ...assets.img.ship.level4.slice(0, 2),
  ];

  const rocks = [
    ...assets.img.rock.brown,
    ...assets.img.rock.grey,
    ...assets.img.rock.giant,
  ];

  // const bosses = [
  //   assets.img.ship.level1[2],
  //   assets.img.ship.level2[2],
  //   assets.img.ship.level3[2],
  //   assets.img.ship.level4[2],
  //   assets.img.ship.final,
  // ];

  const results = await Promise.all(preloadImages(...ships, ...rocks));

  return {
    Ship: results.slice(0, ships.length),
    Rock: results.slice(ships.length, ships.length + rocks.length),
    // Boss: results.slice(ships.length + rocks.length),
  };
}

type ClassNames = Record<string, boolean>;
export function classNames(map: ClassNames): string {
  return Object.keys(map).reduce((accumulator: string, className: string) => {
    return map[className] ? `${className} ${accumulator}` : "";
  }, "");
}
