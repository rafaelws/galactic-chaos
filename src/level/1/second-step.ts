import { assets, getImage } from "@/common/asset";
import { trigger } from "@/common/events";
import { randInRange } from "@/common/math";
import { Boss, BossPhase, PlayerItem, Rock, Ship } from "@/objects";
import { EffectType, ImpactParams } from "@/objects/shared";
import { AudioEvent } from "@/common";

function secondPhaseRocks(): Rock[] {
  let rocks = [];

  const baseTimeout = 15000;
  const impact = { collisionTimeout: 1000 };

  for (let j = 0; j <= 1; j++) {
    for (let i = 1; i < 9; i++) {
      const whichRock = Math.floor(randInRange(5, 10));
      const img = getImage(assets.img.rock.brown[whichRock]);
      const base = {
        impact,
        spawnTimeout: j * baseTimeout,
        img,
      };
      rocks.push(
        new Rock({
          ...base,
          rotationSpeed: 5,
          movement: {
            start: { x: 0, y: randInRange(0.01, 0.6) },
            angle: randInRange(15, 45),
          },
        }),
        new Rock({
          ...base,
          rotationSpeed: -5,
          movement: {
            start: { x: 1, y: randInRange(0.01, 0.6) },
            angle: -randInRange(15, 45),
          },
        }),
        new Rock({
          ...base,
          rotationSpeed: randInRange(-3, 3),
          movement: {
            start: { x: 0.1 * i, y: 0 },
            angle: randInRange(-45, 45),
          },
        })
      );
    }
  }
  return rocks;
}

function finalPhaseShips(): Ship[] {
  const newItem = () =>
    new PlayerItem({
      img: getImage(assets.img.player.items.heal),
      effect: { type: EffectType.heal, amount: 5 },
      timeout: 10 * 1000,
    });

  const base = {
    impact: { collisionTimeout: 1000 },
    fire: { rate: 350 },
  };

  return [
    new Ship({
      ...base,
      img: getImage(assets.img.ship.level1[0]),
      movement: { start: { x: 1, y: 0.1 }, angle: 90 },
      spawnables: [newItem()],
    }),
    new Ship({
      ...base,
      img: getImage(assets.img.ship.level1[0]),
      movement: { start: { x: 0, y: 0.1 }, angle: -90 },
      spawnables: [newItem()],
    }),
    new Ship({
      ...base,
      spawnTimeout: 3000,
      img: getImage(assets.img.ship.level1[1]),
      movement: { start: { x: 0, y: 0.3 }, angle: 90 },
      spawnables: [newItem()],
    }),
    new Ship({
      ...base,
      spawnTimeout: 3000,
      img: getImage(assets.img.ship.level1[1]),
      movement: { start: { x: 0, y: 0.3 }, angle: -90 },
      spawnables: [newItem()],
    }),
  ];
}

function phases(): BossPhase[] {
  const impact: ImpactParams = {
    collisionTimeout: 1000,
    power: 2,
  };

  const firstPhase: BossPhase = {
    nextPhaseCondition: ({ hp, maxHp }) => hp <= maxHp * 0.8,
    impact,
    fire: {
      power: 1,
      rate: 50,
    },
    cyclicMovement: {
      angle: 60,
      speed: 0.55,
      // start: { x: 0.1, y: 0 },
      start: { x: 0, y: 0 },
      cycle: {
        increment: { y: 0, x: 0.1 },
      },
    },
  };

  const secondPhase: BossPhase = {
    nextPhaseCondition: ({ hp, maxHp }) => hp <= maxHp * 0.4,
    impact,
    fire: {
      power: 1.5,
      rate: 150,
      precision: "LOOSE",
    },
    cyclicMovement: {
      angle: -25,
      speed: 0.5,
      start: { x: 1, y: 0 },
      cycle: {
        increment: { y: 0, x: -0.35 },
      },
    },
    spawnables: secondPhaseRocks(),
  };

  const thirdPhase: BossPhase = {
    nextPhaseCondition: () => false,
    impact,
    fire: {
      power: 2,
      rate: 150,
      precision: "ACCURATE",
    },
    cyclicMovement: {
      angle: 90,
      speed: 0.75,
      start: { x: 0, y: 0.01 },
      cycle: {
        increment: { y: 0.1, x: 0 },
      },
    },
    spawnables: finalPhaseShips(),
  };

  return [firstPhase, secondPhase, thirdPhase];
}

export function secondStep() {
  trigger(AudioEvent.mainStream, {
    filePath: assets.audio.levels[0].boss,
  });

  return [
    new Boss({
      hp: 100,
      phases: phases(),
      img: getImage(assets.img.ship.level1[2]),
    }),
  ];
}
