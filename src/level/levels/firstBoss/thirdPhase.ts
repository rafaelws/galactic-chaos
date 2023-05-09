import { assets, getImage } from "@/common/asset";
import { p } from "@/common/meta";
import { BossPhase, healItem, Ship } from "@/objects";
import { FirePrecision, linear } from "@/objects/shared";

function spawnShips(): Ship[] {
  const newItem = () => healItem(2.5, { timeout: 10 * 1000 });

  const shipCommon = {
    hp: 3,
    impact: { collisionTimeout: 1000 },
    fire: { rate: 500 },
  };

  return [
    new Ship({
      ...shipCommon,
      img: getImage(assets.img.ship.level1[0]),
      movement: linear(p(1, 0.1), p(0, 0.1))
        .linear(p(0, 0.1), p(1, 0.1))
        .repeatable(),
      spawnables: [newItem()],
    }),
    new Ship({
      ...shipCommon,
      img: getImage(assets.img.ship.level1[0]),
      movement: linear(p(0, 0.1), p(1, 0.1))
        .linear(p(1, 0.1), p(0, 0.1))
        .repeatable(),
      spawnables: [newItem()],
    }),
    new Ship({
      ...shipCommon,
      spawnTimeout: 6 * 1000,
      img: getImage(assets.img.ship.level1[1]),
      movement: linear(p(1, 0.3), p(0, 0.3))
        .linear(p(0, 0.3), p(1, 0.3))
        .repeatable(),
      spawnables: [newItem()],
    }),
    new Ship({
      ...shipCommon,
      spawnTimeout: 6 * 1000,
      img: getImage(assets.img.ship.level1[1]),
      movement: linear(p(0, 0.3), p(1, 0.3))
        .linear(p(1, 0.3), p(0, 0.3))
        .repeatable(),
      spawnables: [newItem()],
    }),
  ];
}

export const thirdPhase = (): BossPhase => ({
  nextPhaseCondition: () => false,
  impact: { collisionTimeout: 1000 },
  fire: {
    rate: 150,
    precision: FirePrecision.Accurate,
  },
  movement: linear(p(0, 0.2), p(1, 0.2), 4)
    .linear(p(1, 0.35), p(0, 0.35), 4)
    .linear(p(1, 0.5), p(0, 0.5), 4)
    .linear(p(0, 0.65), p(1, 0.65), 4)
    .linear(p(0, 0.8), p(1, 0.8), 4)
    .repeatable(),
  spawnables: spawnShips(),
});
