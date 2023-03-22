// FIXME
import { p } from "@/common/meta";
import { assets, getImage } from "@/common/asset";
import { rir } from "@/common/math";
import { Boss, BossPhase, PlayerItem, Rock, Ship } from "@/objects";
import {
  EffectType,
  FirePrecision,
  ImpactParams,
  FluentMovement,
} from "@/objects/shared";
import { AudioManager } from "@/main/AudioManager";

function secondPhaseRocks(): Rock[] {
  let rocks = [];
  for (let i = 1; i <= 18; i++) {
    const whichRock = Math.floor(rir(5, 10));
    const img = getImage(assets.img.rock.brown[whichRock]);
    const rockCommon = {
      impact: { collisionTimeout: 1000 },
      spawnTimeout: (i <= 9 ? 1 : 2) * 5000,
      img,
      rotationSpeed: rir(-5, 5),
    };

    rocks.push(
      // from above
      new Rock({
        ...rockCommon,
        movement: new FluentMovement()
          .linear(p(rir(0, 1), 0), p(rir(0, 1), 1))
          .get(),
      }),
      // right to left
      new Rock({
        ...rockCommon,
        movement: new FluentMovement()
          .linear(p(1, rir(0, 1)), p(0, rir(0, 1)))
          .get(),
      }),
      // left to right
      new Rock({
        ...rockCommon,
        movement: new FluentMovement()
          .linear(p(0, rir(0, 1)), p(1, rir(0, 1)))
          .get(),
      })
    );
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

  const shipCommon = {
    impact: { collisionTimeout: 1000 },
    fire: { rate: 350 },
  };

  return [
    new Ship({
      ...shipCommon,
      img: getImage(assets.img.ship.level1[0]),
      movement: new FluentMovement().linear(p(1, 0.1), p(0, 0.1)).get(),
      spawnables: [newItem()],
    }),
    new Ship({
      ...shipCommon,
      img: getImage(assets.img.ship.level1[0]),
      movement: new FluentMovement().linear(p(0, 0.1), p(1, 0.1)).get(),
      spawnables: [newItem()],
    }),
    new Ship({
      ...shipCommon,
      spawnTimeout: 3000,
      img: getImage(assets.img.ship.level1[1]),
      movement: new FluentMovement().linear(p(1, 0.3), p(0, 0.3)).get(),
      spawnables: [newItem()],
    }),
    new Ship({
      ...shipCommon,
      spawnTimeout: 3000,
      img: getImage(assets.img.ship.level1[1]),
      movement: new FluentMovement().linear(p(0, 0.3), p(1, 0.3)).get(),
      spawnables: [newItem()],
    }),
  ];
}

// TODO
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
    movement: new FluentMovement()
      .quadraticBezier(p(0, 0), p(0.5, 1), p(1, 0))
      .linear(p(1, 0), p(0, 0.5))
      .linear(p(0, 0.5), p(1, 1))
      // .quadraticBezier(c(1, 0), c(0.5, 0.3), c(0, 1))
      // .linear(c(0, 1), c(1, 0.6))
      .get(),
  };

  const secondPhase: BossPhase = {
    nextPhaseCondition: ({ hp, maxHp }) => hp <= maxHp * 0.4,
    impact,
    fire: {
      power: 1.5,
      rate: 250,
      precision: FirePrecision.Loose,
    },
    movement: new FluentMovement()
      .cubicBezier(p(0, 0), p(0.5, 0.35), p(0.35, 0.5), p(0, 1), 2)
      .cubicBezier(p(1, 0), p(0.35, 0.5), p(0.5, 0.35), p(0, 0), 2)
      .repeatable()
      .get(),
    spawnables: secondPhaseRocks(),
  };

  const thirdPhase: BossPhase = {
    nextPhaseCondition: () => false,
    impact,
    fire: {
      power: 2,
      rate: 300,
      precision: FirePrecision.Accurate,
    },
    movement: new FluentMovement()
      .linear(p(0, 0.2), p(1, 0.2), 3)
      .linear(p(1, 0.35), p(0, 0.35), 3)
      .linear(p(1, 0.5), p(0, 0.5), 3)
      .linear(p(0, 0.65), p(1, 0.65), 3)
      .linear(p(0, 0.8), p(1, 0.8), 3)
      .get(),
    spawnables: finalPhaseShips(),
  };

  return [firstPhase, secondPhase, thirdPhase];
}

function startSong() {
  AudioManager.play(assets.audio.levels[0].boss);
}

export function secondStep() {
  const songLength = 94;
  startSong();

  return [
    new Boss({
      hp: 3,
      phases: phases(),
      img: getImage(assets.img.ship.level1[2]),
    }),
  ];
}
