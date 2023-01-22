import { loadImages } from "@/common/asset";
import { ControlState } from "@/common/controls";
import { Drawable, GameState } from "@/common/meta";
import { Level } from "./Level";

export class LevelManager {
  private loaded = false;
  private loading = false;

  private currentLevel = -1;
  private finalLevel = -1;

  private currentStep = -1;
  private finalStep = -1;

  private drawables: Drawable[] = [];

  constructor(private readonly levels: Level[]) {
    this.nextLevel();
  }

  private nextLevel() {
    this.loaded = false;
    this.loading = false;
    this.currentLevel++;
    this.finalLevel = this.levels.length;
    this.currentStep = -1;
    this.finalStep = this.level.steps.length;
  }

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

  public update(state: GameState, controls: ControlState): void {
    if (!this.loaded) {
      this.load();
      return;
    }

    if (this.loading) return;

    let actives = [];
    for (let i = 0; i < this.drawables.length; i++) {
      let drawable = this.drawables[i];
      drawable.update(state, controls);
      if (drawable.isActive()) actives.push(drawable);
    }
    this.drawables = actives;
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (this.loading || !this.loaded) return;
    for (let i = 0; i < this.drawables.length; i++) {
      this.drawables[i].draw(c);
    }
    if (this.drawables.length == 0) {
      this.step();
    }
  }

  private get level() {
    return this.levels[this.currentLevel];
  }
}
