import { assets, getImage } from "@/common/asset";
import { PlayerItem, Rock, Ship } from "@/objects";

export function firstStep() {
  const rock3 = getImage(assets.img.rock.brown[3]);
  return [
    new PlayerItem({
      img: getImage(assets.img.player.items.heal),
      position: { x: 500, y: 500 },
      effect: {
        type: "HEAL",
        amount: 5,
      },
    }),
    new Rock({
      img: rock3,
      hp: 1,
      selfRotation: -5,
      movement: {
        start: { x: 0.15, y: 0 },
        speed: 0.03,
        // angle: 60,
      },
      impact: {
        power: 2,
        resistance: 1,
        collisionTimeout: 200,
      },
      spawnOnDestroy: new PlayerItem({
        effect: { type: "HEAL", amount: 1 },
        img: getImage(assets.img.player.items.heal),
      }),
    }),
    new Rock({
      img: rock3,
      hp: 5,
      selfRotation: 10,
      spawnDelay: 1000,
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
      spawnDelay: 2000,
      movement: {
        start: { x: 0.5, y: 0 },
        angle: 60,
        speed: 0.2,
      },
    }),
    new Ship({
      img: getImage(assets.img.ship.level1[0]),
      hp: 30,
      spawnDelay: 1000,
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
      spawnDelay: 0,
      hp: 30,
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
        resistance: 0,
        collisionTimeout: 1000, // TODO
      },
    }),
  ];
}
