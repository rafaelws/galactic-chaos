import { iterate } from "@/common/util";
import { ControlState } from "@/common/controls";
import { Boundaries, Destroyable, GameObject, GameState } from "@/common/meta";
import { assets, getImage, loadImages } from "@/common/asset";
import { Player } from "@/objects";
import { Level } from "./Level";
import { firstLevel } from "./1";

export class LevelManager implements Destroyable {
  private loaded = false;
  private loading = false;

  private currentLevel = -1;
  private finalLevel = -1;

  private currentStep = -1;
  private finalStep = -1;

  private gameObjects: GameObject[] = [];
  private readonly levels: Level[] = [firstLevel];

  private player?: Player;

  private get level() {
    return this.levels[this.currentLevel];
  }

  constructor() {
    this.nextLevel();
  }

  public destroy(): void {
    if (this.player) this.player.destroy();
  }

  /*
  private verifyProjectileCollision(drawable: GameObject) {
    const projectiles = this.player!.getProjectiles();

    iterate(projectiles, (projectile) => {
      if (hasCollided(projectile.hitbox, drawable.hitbox)) {
        // TODO
        console.log("projectile hit", projectile, drawable);
        projectile.handleHit(0);
        drawable.handleHit(1);
      }
    });
  }
  */

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
      this.gameObjects = this.level.steps[++this.currentStep]();
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
    controlState: ControlState
  ): void {
    if (this.loading) return;

    if (!this.loaded) {
      this.load();
      return;
    }

    let state: GameState = {
      debug: true,
      delta,
      worldBoundaries,
      player: { x: 0, y: 0, radius: 0 },
    };

    if (!this.player) {
      this.player = new Player({
        img: getImage(assets.img.player.self),
      });
    } else {
      // IMPORTANT: player sets `state.player` on update
      this.player.controlState = controlState;
      this.player.update(state);

      let actives: GameObject[] = [];
      iterate(this.gameObjects, (gameObject) => {
        gameObject.update(state);
        if (gameObject.isActive) {
          // this.verifyProjectileCollision(gameObject);
          actives.push(gameObject);
        }
      });
      this.gameObjects = actives;
    }
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (this.loading || !this.loaded) return;

    this.player?.draw(c);
    iterate(this.gameObjects, (gameObject) => gameObject.draw(c));

    if (this.gameObjects.length == 0) this.step();
  }
}
