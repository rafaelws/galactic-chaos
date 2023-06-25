import { assets, preloadImages } from "@/core/asset";

export type Assets = Record<string, HTMLImageElement[]>;

export async function getAssets(): Promise<Assets> {
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

  const bosses = [
    assets.img.ship.level1[2],
    assets.img.ship.level2[2],
    assets.img.ship.level3[2],
    assets.img.ship.level4[2],
    assets.img.ship.final,
  ];

  const results = await Promise.all(
    preloadImages(...ships, ...rocks, ...bosses)
  );

  return {
    ships: results.slice(0, ships.length),
    rocks: results.slice(ships.length, ships.length + rocks.length),
    bosses: results.slice(ships.length + rocks.length),
  };
}
