import { assets, getImage } from "@/common/asset";
import { dice, riir, rir } from "@/common/math";
import { p } from "@/common/meta";
import { BossPhase, healItem, Rock } from "@/objects";
import { cubicBezier, FirePrecision, linear } from "@/objects/shared";

function spawnRocks(): Rock[] {
  let rocks = [];
  for (let i = 0; i < 10; i++) {
    const timeOffset = (i < 5 ? 0 : 10) * 1000;
    const impact = { collisionTimeout: 1000 };

    rocks.push(
      // from above
      new Rock({
        impact,
        rotationSpeed: rir(-5, 5),
        spawnTimeout: rir(0, 5000) + timeOffset,
        img: getImage(assets.img.rock.brown[riir(0, 6)]),
        movement: linear(p(rir(0, 1), 0), p(rir(0, 1), 1)),
        spawnables: dice() ? [healItem(riir(1, 4))] : [],
      }),
      // right to left
      new Rock({
        impact,
        rotationSpeed: rir(-5, 5),
        spawnTimeout: rir(0, 5000) + timeOffset,
        img: getImage(assets.img.rock.brown[riir(0, 6)]),
        movement: linear(p(1, rir(0, 1)), p(0, rir(0, 1))),
        spawnables: dice() ? [healItem(riir(1, 4))] : [],
      }),
      // left to right
      new Rock({
        impact,
        rotationSpeed: rir(-5, 5),
        spawnTimeout: rir(0, 5000) + timeOffset,
        img: getImage(assets.img.rock.brown[riir(0, 6)]),
        movement: linear(p(0, rir(0, 1)), p(1, rir(0, 1))),
        spawnables: dice() ? [healItem(riir(1, 4))] : [],
      })
    );
  }
  return rocks;
}

export const secondPhase = (): BossPhase => ({
  nextPhaseCondition: ({ hp, maxHp }) => hp <= maxHp * 0.4,
  impact: { collisionTimeout: 1000 },
  fire: {
    rate: 200,
    precision: FirePrecision.Loose,
  },
  movement: cubicBezier(p(0, 1), p(0.15, 0.15), p(0.85, 0.85), p(1, 0), 3.5)
    .cubicBezier(p(1, 0), p(0.15, 0.15), p(0.85, 0.85), p(0, 1), 3.5)
    .cubicBezier(p(0, 0), p(0.85, 0.15), p(0.15, 0.85), p(1, 1), 3.5)
    .cubicBezier(p(1, 1), p(0.85, 0.15), p(0.15, 0.85), p(0, 0), 3.5)
    .repeatable(),
  spawnables: spawnRocks(),
});
