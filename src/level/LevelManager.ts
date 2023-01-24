import { assets, getImage, loadImages } from "@/common/asset";
import { ControlState } from "@/common/controls";
import { ListenerMap, set, unset } from "@/common/events";
import { hasCollided } from "@/common/math";
import { Boundaries, Destroyable, Drawable, GameState } from "@/common/meta";
import { iterate } from "@/common/util";
import { Player } from "@/objects";
import { firstLevel } from "./1";
import { Level } from "./Level";

export class LevelManager implements Destroyable {
  private loaded = false;
  private loading = false;

  private currentLevel = -1;
  private finalLevel = -1;

  private currentStep = -1;
  private finalStep = -1;

  private listeners: ListenerMap = {};
  private drawables: Drawable[] = [];
  private readonly levels: Level[] = [firstLevel];

  private player?: Player;

  constructor() {
    this.listeners = { impact: this.handleImpact.bind(this) };
    set(this.listeners);
    this.nextLevel();
  }

  private handleImpact(ev: Event) {
    const magnitude = (ev as CustomEvent).detail;
    // TODO update player status
    console.log("player hit", magnitude);
  }

  public destroy() {
    unset(this.listeners);
  }

  private nextLevel() {
    this.loaded = false;
    this.loading = false;
    this.currentLevel++;
    this.finalLevel = this.levels.length;
    this.currentStep = -1;
    this.finalStep = this.level.steps.length;
  }

  // *** FIXME ***
  private step(): void {
    if (this.currentLevel >= this.finalLevel) return;
    if (this.currentStep < this.finalStep) {
      this.drawables = this.level.steps[++this.currentStep]();
    } else {
      this.nextLevel();
    }
  }

  private async load(): Promise<void> {
    if (this.loading || this.loaded) return;

    this.loading = true;

    // TODO audio
    const { images } = this.level;
    if (!!images) {
      await Promise.all(loadImages(...images));
    }

    this.loaded = true;
    this.loading = false;
  }

  public update(
    delta: number,
    worldBoundaries: Boundaries,
    controls: ControlState
  ): void {
    if (this.loading) return;

    if (!this.loaded) {
      this.load();
      return;
    }

    let state: GameState = {
      delta,
      worldBoundaries,
      player: { x: 0, y: 0, radius: 0 },
    };

    if (!this.player) {
      this.player = new Player(getImage(assets.img.player.self));
    } else {
      // IMPORTANT: player sets `state.player` on update
      this.player.update(state, controls);

      const { projectiles } = this.player;

      let actives: Drawable[] = [];
      iterate(this.drawables, (drawable) => {
        drawable.update(state);
        if (drawable.isActive) {
          this.verifyProjectileCollision(projectiles, drawable);
          actives.push(drawable);
        }
      });
      this.drawables = actives;
    }
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (this.loading || !this.loaded) return;

    this.player?.draw(c);
    iterate(this.drawables, (drawable) => drawable.draw(c));

    if (this.drawables.length == 0) this.step();
  }

  private get level() {
    return this.levels[this.currentLevel];
  }

  // n²?
  private verifyProjectileCollision(
    projectiles: Drawable[],
    drawable: Drawable
  ) {
    iterate(projectiles, (projectile) => {
      if (hasCollided(projectile.hitbox, drawable.hitbox)) {
        // TODO
        console.log("projectile hit", projectile, drawable);
        // projectile.notify()
        // drawable.notify()
      }
    });
  }
}
