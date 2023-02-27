import { assets, getImage } from "@/common/asset";
import { trigger } from "@/common/events";
import { PlayerItem, Rock, Ship } from "@/objects";
import { EffectType } from "@/objects/shared";
import { AudioEvent } from "@/common";

export function _firstStep() {
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
  ];
}

export function firstStep() {
  trigger(AudioEvent.mainStream, {
    filePath: assets.audio.levels[0].theme,
  });

  const rock3 = getImage(assets.img.rock.brown[3]);
  return [
    new PlayerItem({
      img: getImage(assets.img.player.items.heal),
      position: { x: 500, y: 500 },
      effect: {
        type: EffectType.heal,
        amount: 5,
      },
    }),
    new Rock({
      img: rock3,
      hp: 1,
      rotationSpeed: -5,
      movement: {
        start: { x: 0.15, y: 0 },
        speed: 0.03,
        // angle: 60,
      },
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
    }),
    new Rock({
      img: rock3,
      hp: 5,
      rotationSpeed: 10,
      spawnTimeout: 1000,
      movement: {
        start: { x: 0, y: 0.5 },
        angle: -60,
      },
      impact: {
        collisionTimeout: 1000,
      },
    }),
    new Rock({
      img: rock3,
      hp: 10,
      spawnTimeout: 2000,
      movement: {
        start: { x: 0.5, y: 0 },
        angle: 60,
        speed: 0.2,
      },
    }),
    new Ship({
      img: getImage(assets.img.ship.level1[0]),
      spawnTimeout: 1000,
      movement: {
        angle: 15,
        start: { x: 0.5, y: 0 },
        speed: 0.2,
      },
      fire: {
        rate: 500,
        // angle: 55,
        // precision: "SIMPLE",
      },
    }),
    new Ship({
      img: getImage(assets.img.ship.level1[1]),
      spawnTimeout: 0,
      movement: {
        angle: 15,
        start: { x: 0.1, y: 0 },
        speed: 0.5,
      },
      fire: {
        rate: 350,
        // angle: 50,
        precision: "ACCURATE",
      },
      impact: {
        resistance: 1, // if player.firePower === 1, then this one is indestructible
        collisionTimeout: 1000, // TODO
      },
    }),
  ];
}
