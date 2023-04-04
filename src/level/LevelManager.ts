import { Boundaries, Destroyable, GameState } from "@/common/meta";
import { ListenerMap, readEvent, set, trigger, unset } from "@/common/events";
import { Config } from "@/common";
import { NoDebug } from "@/common/debug";
import { iterate } from "@/common/util";
import { ControlState } from "@/common/controls";
import { assets, getImage } from "@/common/asset";
import { BackgroundManager, GameEvent, GameObject, Player } from "@/objects";

import { CollisionManager } from "./CollisionManager";
import { firstLevel, firstBoss } from "./levels";

type LevelFn = () => Promise<GameObject[]>;

export class LevelManager implements Destroyable {
  private loading = false;
  private finalLevelIx = -1;
  private currentLevelIx = -1;

  private gameObjects: GameObject[] = [];
  private objectsToSpawn: GameObject[] = [];
  private readonly levels: LevelFn[] = [firstLevel, firstBoss];

  private listeners: ListenerMap;

  private player?: Player;
  private background?: BackgroundManager;
  private collision?: CollisionManager;

  constructor() {
    this.listeners = {
      [GameEvent.Spawn]: (ev: globalThis.Event) => {
        this.objectsToSpawn.push(readEvent<GameObject>(ev));
      },
      [GameEvent.BossDefeated]: (_: globalThis.Event) => {
        this.nextLevel();
      },
      [Config.Key.BackgroundDensity]: (ev: globalThis.Event) => {
        if (this.background) this.background.density = readEvent<number>(ev);
      },
    };
    set(this.listeners);

    this.finalLevelIx = this.levels.length;
    this.nextLevel();
  }

  public destroy(): void {
    unset(this.listeners);
  }

  private nextLevel() {
    if (++this.currentLevelIx < this.finalLevelIx) {
      this.loading = true;

      this.levels[this.currentLevelIx]()
        .then((objects) => {
          this.gameObjects = this.gameObjects.concat(objects);
        })
        .catch((err) => console.error("could not load assets", err))
        .finally(() => {
          this.loading = false;
        });
    } else {
      trigger(GameEvent.GameEnd);
    }
  }

  public update(
    delta: number,
    worldBoundaries: Boundaries,
    controlState: ControlState,
    debug = NoDebug
  ): void {
    if (this.loading) return;
    if (!this.player) {
      this.player = new Player({
        img: getImage(assets.img.player.self),
        damageStages: [
          getImage(assets.img.player.damage[0]),
          getImage(assets.img.player.damage[1]),
          getImage(assets.img.player.damage[2]),
        ],
      });
      if (!this.collision) this.collision = new CollisionManager(this.player);
      if (!this.background)
        this.background = new BackgroundManager(
          Config.get(Config.Key.BackgroundDensity)
        );
    } else {
      // most operations are order dependent
      const playerState: GameState = {
        debug,
        delta,
        worldBoundaries,
        player: { x: 0, y: 0, radius: 0 },
      };
      this.player.controlState = controlState;
      this.player.update(playerState);

      const state = { ...playerState, player: this.player.hitbox };

      if (this.objectsToSpawn.length > 0) {
        this.gameObjects = this.objectsToSpawn.concat(this.gameObjects);
        this.objectsToSpawn = [];
      }

      // update/rendering order: background, player/gameObjects, collisions
      this.background?.update(state);

      const actives: GameObject[] = [];
      iterate(this.gameObjects, (gameObject) => {
        gameObject.update(state);
        if (gameObject.isActive) {
          this.collision?.check(gameObject);
          actives.push(gameObject);
        }
      });
      this.gameObjects = actives;

      this.collision?.update(state);
    }
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (this.loading) return;
    // update/rendering order: background, player/gameObjects, collisions
    this.background?.draw(c);

    this.player?.draw(c);
    iterate(this.gameObjects, (gameObject) => gameObject.draw(c));
    this.collision?.draw(c);

    if (this.gameObjects.length == 0) this.nextLevel();
  }
}
