import { iterate } from "@/common/util";
import { Boundaries, Destroyable, GameState } from "@/common/meta";
import { ListenerMap, readEvent, set, trigger, unset } from "@/common/events";
import { ControlState } from "@/common/controls";
import { assets, getImage, preloadAudio, preloadImages } from "@/common/asset";
import { BackgroundManager, GameEvent, GameObject, Player } from "@/objects";

import { Level } from "./Level";
import { firstLevel } from "./1";
import { CollisionManager } from "./CollisionManager";

export class LevelManager implements Destroyable {
  private loaded = false;
  private loading = false;

  private currentLevel = -1;
  private finalLevel = -1;

  private currentStep = -1;
  private finalStep = -1;

  private player?: Player;
  private background?: BackgroundManager;
  private collision?: CollisionManager;
  private gameObjects: GameObject[] = [];
  private prependables: GameObject[] = [];

  private listeners: ListenerMap;

  private readonly levels: Level[] = [firstLevel];

  constructor() {
    this.listeners = {
      [GameEvent.spawn]: (ev: globalThis.Event) => {
        this.prependables.push(readEvent<GameObject>(ev));
      },
    };
    set(this.listeners);

    this.finalLevel = this.levels.length;
    this.nextLevel();
  }

  private get level() {
    return this.levels[this.currentLevel];
  }

  public destroy(): void {
    unset(this.listeners);
  }

  private nextLevel() {
    if (++this.currentLevel < this.finalLevel) {
      this.loaded = false;
      this.loading = false;
      this.currentStep = -1;
      this.finalStep = this.level.steps.length;
    } else {
      trigger(GameEvent.gameEnd);
    }
  }

  private nexStep(): void {
    if (++this.currentStep < this.finalStep) {
      this.gameObjects = this.level.steps[this.currentStep]();
    } else {
      this.nextLevel();
    }
  }

  private async load(): Promise<void> {
    if (this.loading || this.loaded) return;
    this.loading = true;
    // TODO trigger loading=true

    const { images, audios } = this.level;

    await Promise.all([
      ...preloadAudio(audios || []),
      ...preloadImages(images || []),
    ]);

    this.loaded = true;
    this.loading = false;
    // TODO trigger loading=false
  }

  public update(
    delta: number,
    worldBoundaries: Boundaries,
    controlState: ControlState,
    debug = false
  ): void {
    if (this.loading) return;

    if (!this.loaded) {
      this.load();
      return;
    }

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
      if (!this.background) this.background = new BackgroundManager();
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

      // verify performance impacts
      if (this.prependables.length > 0) {
        this.gameObjects = this.prependables.concat(this.gameObjects);
        this.prependables = [];
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
    if (this.loading || !this.loaded) return;

    // update/rendering order: background, player/gameObjects, collisions
    this.background?.draw(c);

    this.player?.draw(c);
    iterate(this.gameObjects, (gameObject) => gameObject.draw(c));

    this.collision?.draw(c);

    if (this.gameObjects.length == 0) this.nexStep();
  }
}
