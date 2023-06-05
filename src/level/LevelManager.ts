import { Boundaries, Destroyable, GameState } from "@/common/meta";
import { Config, ConfigKey, UnsubFn } from "@/common";
import { NoDebug } from "@/common/debug";
import { iterate } from "@/common/util";
import { ControlState } from "@/common/controls";
import { assets, getImage } from "@/common/asset";
import { BackgroundManager, GameObject, Player } from "@/objects";

import { CollisionManager } from "./CollisionManager";
import { firstLevel, firstBoss } from "./levels";
import { events } from "@/common/events";

type LevelFn = () => Promise<GameObject[]>;

export class LevelManager implements Destroyable {
  private loading = false;
  private finalLevelIx = -1;
  private currentLevelIx = -1;

  private gameObjects: GameObject[] = [];
  private objectsToSpawn: GameObject[] = [];
  private readonly levels: LevelFn[] = [firstLevel, firstBoss];

  private subscribers: UnsubFn[];

  private player?: Player;
  private background?: BackgroundManager;
  private collision?: CollisionManager;

  constructor() {
    this.subscribers = [
      events.game.onSpawn(gameObject => {
        this.objectsToSpawn.push(gameObject);
      }),
      events.game.onPlayerHp(ev => {
        if (ev.hp <= 0) events.game.over();
      }),
      events.game.onBossHp(ev => {
        if (ev.hp <= 0) this.nextLevel();
      }),
      events.config.onBackgroundDensity((density: number) => {
        if (this.background) this.background.density = density;
      })
    ];

    this.finalLevelIx = this.levels.length;
    this.nextLevel();
  }

  public destroy(): void {
    this.subscribers.forEach(unsub => unsub());
  }

  private nextLevel() {
    if (++this.currentLevelIx < this.finalLevelIx) {
      this.loading = true;

      this.levels[this.currentLevelIx]()
        .then((objects) => {
          this.gameObjects.push(...objects);
        })
        .catch((err) => console.error("could not load assets", err))
        .finally(() => {
          this.loading = false;
        });
    } else {
      events.game.end();
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
          Config.get(ConfigKey.BackgroundDensity)
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
        this.objectsToSpawn.push(...this.gameObjects);
        this.gameObjects = this.objectsToSpawn;
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
