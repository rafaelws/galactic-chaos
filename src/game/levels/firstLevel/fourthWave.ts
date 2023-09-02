import { getImage } from "@/core/asset";
import { dice, riir } from "@/core/math";
import { p } from "@/core/meta";
import { healItem, Ship, ShipParams } from "@/core/objects";
import { FirePrecision, linear, quadraticBezier } from "@/core/objects/shared";

import { FirstLevelShips } from ".";

const time = 30 * 1000;
const beatTime = 0.999 * 1000;

function arcShips(shipPath: string, offset = 0, fromLeft = true, amount = 4) {
  const objects = [];
  const overallTime = 12 * 1000 + time + offset;

  const fire = {
    precision: FirePrecision.Loose,
    rate: beatTime * 0.75,
  };

  const movement = quadraticBezier(
    p(fromLeft ? 0 : 1, 0),
    p(fromLeft ? 1 : 0, 0.5),
    p(fromLeft ? 0 : 1, 1),
    3
  );

  for (let i = 0; i < amount; i++) {
    const params: ShipParams = {
      spawnTimeout: overallTime + i * 1000,
      movement,
      fire,
      img: getImage(shipPath),
      hp: riir(1, 4),
    };
    if (dice()) params.spawnables = [healItem(riir(1, 4))];
    objects.push(new Ship(params));
  }
  return objects;
}

export function fourthWave(ships: FirstLevelShips) {
  const simpleFire = {
    rate: beatTime,
  };

  return [
    // more vertical spacing between ships
    new Ship({
      hp: 5,
      spawnTimeout: time + 2000,
      img: getImage(ships[0]),
      movement: linear(p(0, 0.1), p(1, 0.1), 0.5),
      spawnables: [healItem(2)],
      fire: simpleFire,
    }),
    new Ship({
      hp: 5,
      spawnTimeout: time,
      img: getImage(ships[0]),
      movement: linear(p(0, 0.4), p(1, 0.4), 0.5),
      spawnables: [healItem(1)],
      fire: simpleFire,
    }),
    new Ship({
      hp: 5,
      spawnTimeout: time + 2000,
      img: getImage(ships[0]),
      movement: linear(p(1, 0.25), p(0, 0.25), 0.5),
      spawnables: [healItem(1)],
      fire: simpleFire,
    }),
    new Ship({
      hp: 5,
      spawnTimeout: time,
      img: getImage(ships[0]),
      movement: linear(p(1, 0.55), p(0, 0.55), 0.5),
      spawnables: [healItem(2)],
      fire: simpleFire,
    }),
    ...arcShips(ships[1], 0, true, 5),
    ...arcShips(ships[1], 5000, false, 5),
  ];
}
