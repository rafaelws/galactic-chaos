import { assets, getImage } from "@/common/asset";
import { p } from "@/common/meta";
import { PlayerItem, Rock, Ship } from "@/objects";
import { EffectType, FirePrecision, FluentMovement } from "@/objects/shared";
import { AudioManager } from "@/main/AudioManager";

const shipLinear = new FluentMovement()
  .linear(p(0, 0.15), p(1, 0.15))
  .linear(p(1, 0.15), p(0, 0.15), 2)
  .repeatable()
  .get();

const cubic = new FluentMovement()
  .repeatable()
  .cubicBezier(p(1, 0), p(0, 1), p(1, 1), p(0, 0))
  // p0: { x: 0, y: 0 },
  // p1: { x: 1, y: 1 },
  // p2: { x: 0, y: 1 },
  // p3: { x: 0, y: 1 },

  // p0: { x: 0, y: 0.2 },
  // p1: { x: 0.3, y: 0.4 },
  // p2: { x: 0, y: 0.7 },
  // p3: { x: 0.4, y: 0.3 },
  .cubicBezier(p(0, 0), p(1, 1), p(0, 1), p(0, 1))
  // p0: { x: 0.4, y: 0.3 },
  // p1: { x: 0.5, y: 0.7 },
  // p2: { x: 0, y: 0.2 },
  // p3: { x: 1, y: 0 },
  // speed: 8,
  .get();

const leftQuadratic = new FluentMovement()
  .quadraticBezier(p(0, 0.15), p(0.5, 0.5), p(1, 0.15), 5)
  .repeatable()
  .get();

const crossScreenlinear = new FluentMovement()
  .linear(p(0, 0), p(1, 1))
  .linear(p(1, 1), p(0, 0))
  .repeatable()
  .get();

export function firstStep() {
  return [
    new PlayerItem({
      img: getImage(assets.img.player.items.heal),
      // timeout: 100 * 1000,
      timeout: 1,
      position: { x: 500, y: 500 },
      effect: {
        type: EffectType.heal,
        amount: 5,
      },
    }),
  ];
}

export function _firstStep() {
  AudioManager.play(assets.audio.levels[0].theme);

  const quadraticRock = new Rock({
    img: getImage(assets.img.rock.brown[4]),
    rotationSpeed: 1,
    movement: leftQuadratic,
    impact: {
      power: 2,
      resistance: 0, // if player.firePower == 1, then this one is indestructible
      collisionTimeout: 200,
    },
    spawnables: [
      new PlayerItem({
        effect: { type: EffectType.heal, amount: 1 },
        img: getImage(assets.img.player.items.heal),
      }),
    ],
  });

  const cubicRock = new Rock({
    img: getImage(assets.img.rock.brown[8]),
    movement: cubic,
    impact: {
      collisionTimeout: 1000,
    },
  });

  const ship = new Ship({
    img: getImage(assets.img.ship.level1[0]),
    hp: 10,
    spawnTimeout: 2000,
    movement: cubic,
    // movement: linear,
    // movement: shipLinear,
    // movement: leftQuadratic,
    fire: {
      precision: FirePrecision.Simple,
      rate: 1000,
    },
  });

  const ship2 = new Ship({
    img: getImage(assets.img.ship.level1[0]),
    movement: crossScreenlinear,
    fire: {
      precision: FirePrecision.Loose,
      rate: 2000,
    },
  });

  const ship3 = new Ship({
    img: getImage(assets.img.ship.level1[1]),
    movement: shipLinear,
  });

  return [
    new PlayerItem({
      img: getImage(assets.img.player.items.heal),
      timeout: 100 * 1000,
      position: { x: 500, y: 500 },
      effect: {
        type: EffectType.heal,
        amount: 5,
      },
    }),
    ship,
    cubicRock,
    quadraticRock,
    ship2,
    ship3,
  ];
}
