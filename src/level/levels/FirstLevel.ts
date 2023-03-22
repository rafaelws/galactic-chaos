import { assets, getImage } from "@/common/asset";
import { trigger } from "@/common/events";
import { riir, rir } from "@/common/math";
import { c, GameState } from "@/common/meta";
import { AudioManager } from "@/main/AudioManager";
import { GameObject, Rock } from "@/objects";
import { FluentMovement, GameEvent } from "@/objects/shared";
import { Level, LevelStage } from "../Level";

export class FirstLevel implements Level {
  // 20 (change of pace)
  // 30 (intensity)
  // 42 (+intensity)
  // 50 (climax) [reduce song]
  // 54 (calm)
  // 40 sec to end
  private stages: LevelStage[] = [
    { time: 3.8 * 1000, maxAmount: 0, intervalBetween: 0, spawnables: [] },
    {
      time: 20 * 1000,
      maxAmount: 10,
      intervalBetween: 2 * 1000,
      spawnables: [this.createRock.bind(this)],
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

  private createRock() {
    const which = riir(0, assets.img.rock.brown.length - 5);

    let p0 = c(rir(0, 1), Math.max(rir(-1, 0.5), 0));
    let p1 = c(rir(0, 1), 1);

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

  public update({ delta }: GameState): GameObject[] {
    this.startSong();

    this.timePast += delta;
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

  public audios = [assets.audio.levels[0].theme, assets.audio.levels[0].boss];
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
    assets.img.ship.level1[2],
  ];
}
