import { Boundaries, Destroyable, GameState } from "@/common/meta";
import { Config, ConfigKey, UnsubFn } from "@/common";
import { NoDebug } from "@/common/debug";
import { iterate } from "@/common/util";
import { ControlState } from "@/common/controls";
import { assets, getImage } from "@/common/asset";
import { BackgroundManager, GameObject, Player, Radar } from "@/objects";

import { CollisionManager } from "./CollisionManager";
import { firstLevel, firstBoss } from "./levels";
import { events } from "@/common/events";

type LevelFn = () => Promise<GameObject[]>;

export class LevelManager implements Destroyable {
  private _loading = false;
  private finalLevelIx = -1;
  private currentLevelIx = -1;

  private gameObjects: GameObject[] = [];
  private objectsToSpawn: GameObject[] = [];
  private readonly levels: LevelFn[] = [firstLevel, firstBoss];

  private subscribers: UnsubFn[];

  private player?: Player;
  private background?: BackgroundManager;
  private collision?: CollisionManager;
  private radar?: Radar;

  constructor() {
    this.subscribers = [
      events.game.onSpawn((gameObject) => {
        this.objectsToSpawn.push(gameObject);
      }),
      events.game.onPlayerHp((ev) => {
        if (ev.hp <= 0) events.game.over();
      }),
      events.game.onBossHp((ev) => {
        if (ev.hp <= 0) this.nextLevel();
      }),
      events.config.onBackgroundDensity((density: number) => {
        if (this.background) this.background.density = density;
      }),
    ];

    this.finalLevelIx = this.levels.length;
    this.nextLevel();
  }

  public destroy(): void {
    this.subscribers.forEach((unsub) => unsub());
  }

  private nextLevel() {
    if (++this.currentLevelIx >= this.finalLevelIx) {
      return events.game.end();
    }
    this.loading = true;

    this.levels[this.currentLevelIx]()
      .then((objects) => this.gameObjects.push(...objects))
      // TODO improve error handling
      .catch((err) => console.error("could not load assets", err))
      .finally(() => {
        this.loading = false;
      });
  }

  private initialize() {
    this.player = new Player({
      img: getImage(assets.img.player.self),
      damageStages: assets.img.player.damage.map(getImage),
    });

    this.radar = new Radar();
    this.collision = new CollisionManager(this.player);
    this.background = new BackgroundManager(
      Config.get(ConfigKey.BackgroundDensity)
    );
  }

  private addSpawning() {
    if (this.objectsToSpawn.length === 0) return;
    this.objectsToSpawn.push(...this.gameObjects);
    this.gameObjects = this.objectsToSpawn;
    this.objectsToSpawn = [];
  }

  private updateAll(state: GameState) {
    this.background?.update(state);

    const actives: GameObject[] = [];
    iterate(this.gameObjects, (gameObject) => {
      gameObject.update(state);
      if (!gameObject.isActive) return;

      this.collision?.check(gameObject);
      actives.push(gameObject);
    });
    this.gameObjects = actives;

    this.collision?.update(state);
    this.radar?.update(
      actives.filter((active) => active.isShowing),
      state.worldBoundaries
    );
  }

  public update(
    delta: number,
    worldBoundaries: Boundaries,
    controlState: ControlState,
    debug = NoDebug
  ): void {
    if (this.loading) return;
    if (!this.player) return this.initialize();

    const state: GameState = {
      debug,
      delta,
      worldBoundaries,
      player: { x: 0, y: 0, radius: 0 },
    };

    this.player.controlState = controlState;
    this.player.update(state);

    state.player = this.player.hitbox;

    this.addSpawning();
    this.updateAll(state);
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (this.loading) return;
    this.background?.draw(c);
    this.player?.draw(c);

    iterate(this.gameObjects, (gameObject) => gameObject.draw(c));

    this.collision?.draw(c);
    this.radar?.draw(c);

    if (this.gameObjects.length == 0) this.nextLevel();
  }

  private get loading() {
    return this._loading;
  }

  private set loading(loading: boolean) {
    events.game.loading(loading);
    this._loading = loading;
  }
}
