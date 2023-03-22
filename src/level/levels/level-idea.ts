/*
import { assets, getImage } from "@/common/asset";
import { trigger } from "@/common/events";
import { riir, rir } from "@/common/math";
import { p, GameState } from "@/common/meta";
import { AudioManager } from "@/main/AudioManager";
import { GameObject, PlayerItem, Rock, Ship, ShipParams } from "@/objects";
import {
  EffectType,
  FireParams,
  FirePrecision,
  FluentMovement,
  GameEvent,
} from "@/objects/shared";
import { Level, LevelStage } from "../Level";

// nothing until 3.8
// 20 (change of pace)=19
// 30 (intensity)=29
// 42 (+intensity)=41
// 50 (climax)=finish

export class _FirstLevel implements Level {
  private stages: LevelStage[] = [
    { time: 3.8 * 1000, maxAmount: 0, intervalBetween: 0, spawnables: [] },
    {
      time: 19 * 1000,
      maxAmount: 3,
      intervalBetween: 2 * 1000,
      spawnables: [this.createRock.bind(this)],
    },
    {
      time: 29 * 1000,
      maxAmount: 10,
      intervalBetween: 2 * 1000,
      spawnables: [this.createRock.bind(this, 10)],
    },
    {
      time: 41 * 1000,
      maxAmount: 10,
      intervalBetween: 2 * 1000,
      spawnables: [this.createRock.bind(this), this.createShip.bind(this)],
    },
  ];

  private stageIx = -1;
  private stage: LevelStage | null = null;

  private timePast = 0;
  private lastSpawn = 0;

  private songLength = 94 * 1000;
  private songStarted = false;

  constructor() {
    this.nextStage();
  }

  private createRock(biggestRock = 5) {
    const which = riir(0, assets.img.rock.brown.length - biggestRock);

    let p0 = p(rir(0, 1), Math.max(rir(-1, 0.5), 0));
    let p1 = p(rir(0, 1), 1);

    let speed = rir(0.1, 0.5);
    // console.log({ speed });

    // if (p0.y > 0.5) p1.y = 0;
    if (p0.y > 0) p0.x = riir(0, 2);

    return new Rock({
      rotationSpeed: riir(-5, 6),
      impact: {
        power: 1,
        collisionTimeout: 0,
      },
      img: getImage(assets.img.rock.brown[which]),
      movement: new FluentMovement().linear(p0, p1, speed).get(),
    });
  }

  private createShip() {
    let spawnables = [];
    if (riir(0, 2) === 1) {
      spawnables.push(
        new PlayerItem({
          img: getImage(assets.img.player.items.heal),
          effect: {
            amount: riir(1, 4),
            type: EffectType.heal,
          },
        })
      );
    }

    const fire: FireParams = {
      rate: rir(150, 350),
      power: riir(1, 3),
    };

    switch (riir(0, 3)) {
      case 0:
        fire.precision = FirePrecision.Simple;
        fire.angle = [-60, 60, -45, 45, 180][riir(0, 6)];
        break;
      case 1:
        fire.precision = FirePrecision.Loose;
        break;
      case 2:
        fire.precision = FirePrecision.Accurate;
        break;
      default:
        fire.rate = 0;
        break;
    }

    const params: ShipParams = {
      hp: riir(1, 3),
      img: getImage(assets.img.ship.level1[riir(0, 2)]),
      movement: new FluentMovement().get(),
      spawnables,
      fire,
    };

    return new Ship(params);
  }

  private startSong() {
    if (this.songStarted) return;
    AudioManager.play(assets.audio.levels[0].theme);
    this.songStarted = true;
  }

  private nextStage() {
    if (++this.stageIx > this.stages.length - 1) {
      this.stage = null;
    } else {
      this.stage = this.stages[this.stageIx];
    }
  }

  public update(state: GameState): GameObject[] {
    this.startSong();

    this.timePast += state.delta;
    if (this.timePast >= this.songLength) {
      trigger(GameEvent.nextLevel);
      return [];
    }

    if (!this.stage) return [];
    if (this.timePast - this.lastSpawn < this.stage.intervalBetween) return [];
    this.lastSpawn = this.timePast;

    const whichToSpawn = riir(0, this.stage.spawnables.length);
    const howMany = riir(0, this.stage.maxAmount + 1);

    let objects: GameObject[] = [];
    for (let i = 0; i < howMany; i++) {
      objects.push(this.stage.spawnables[whichToSpawn]());
    }

    if (this.timePast >= this.stage.time) this.nextStage();
    return objects;
  }

  public audios = [assets.audio.levels[0].theme];
  public images = [
    assets.img.player.self,
    assets.img.player.items.heal,
    assets.img.player.damage[0],
    assets.img.player.damage[1],
    assets.img.player.damage[2],
    assets.img.rock.brown[0],
    assets.img.rock.brown[1],
    assets.img.rock.brown[2],
    assets.img.rock.brown[3],
    assets.img.rock.brown[4],
    assets.img.rock.brown[5],
    assets.img.rock.brown[6],
    assets.img.rock.brown[7],
    assets.img.rock.brown[8],
    assets.img.rock.brown[9],
    assets.img.ship.level1[0],
    assets.img.ship.level1[1],
  ];
}
*/
export const foo = 0;
