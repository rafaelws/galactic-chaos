import { assets, getImage } from "@/common/asset";
import { PlayerItem, Rock, Ship } from "@/objects";
import { EffectType, FirePrecision, MovementNature } from "@/objects/shared";
// import { trigger } from "@/common/events";
// import { AudioEvent } from "@/common";

const shipLinear = {
  repeatable: true,
  steps: [
    {
      speed: 2,
      nature: MovementNature.Linear,
      p0: { x: 0, y: 0.15 },
      p1: { x: 1, y: 0.15 },
    },
    {
      speed: 2,
      nature: MovementNature.Linear,
      p0: { x: 1, y: 0.15 },
      p1: { x: 0, y: 0.15 },
    },
  ],
};

const cubic = {
  repeatable: true,
  steps: [
    {
      nature: MovementNature.CubicBezier,
      // p0: { x: 0, y: 0 },
      // p1: { x: 1, y: 1 },
      // p2: { x: 0, y: 1 },
      // p3: { x: 0, y: 1 },

      // p0: { x: 0, y: 0.2 },
      // p1: { x: 0.3, y: 0.4 },
      // p2: { x: 0, y: 0.7 },
      // p3: { x: 0.4, y: 0.3 },

      p0: { x: 1, y: 0 },
      p1: { x: 0, y: 1 },
      p2: { x: 1, y: 1 },
      p3: { x: 0, y: 0 },
    },
    {
      nature: MovementNature.CubicBezier,
      p0: { x: 0, y: 0 },
      p1: { x: 1, y: 1 },
      p2: { x: 0, y: 1 },
      p3: { x: 0, y: 1 },
    },
    /*
    {
      nature: MovementNature.CubicBezier,
      p0: { x: 0.4, y: 0.3 },
      p1: { x: 0.5, y: 0.7 },
      p2: { x: 0, y: 0.2 },
      p3: { x: 1, y: 0 },
      speed: 8,
    },
    */
  ],
};

const leftQuadratic = {
  repeatable: true,
  steps: [
    {
      nature: MovementNature.QuadraticBezier,
      p0: { x: 0, y: 0.15 },
      p1: { x: 0.5, y: 0.5 },
      p2: { x: 1, y: 0.15 },
      speed: 5,
    },
  ],
};

const crossScreenlinear = {
  repeatable: true,
  steps: [
    {
      nature: MovementNature.Linear,
      p0: { x: 0, y: 0 },
      p1: { x: 1, y: 1 },
    },
    {
      nature: MovementNature.Linear,
      p0: { x: 1, y: 1 },
      p1: { x: 0, y: 0 },
    },
  ],
};

export function firstStep() {
  // trigger(AudioEvent.mainStream, {
  //   filePath: assets.audio.levels[0].theme,
  // });

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
