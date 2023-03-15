import { randInRange } from "@/common/math";
import { Drawable, GameState } from "@/common/meta";
import { iterate } from "@/common/util";
import { Star } from "./Star";

export class BackgroundManager implements Drawable {
  private stars: Star[] = [];

  constructor(private howManyParticles = 1000) {}

  public get isActive() {
    return true;
  }

  public set density(amount: number) {
    this.howManyParticles = amount;
  }

  private genColor() {
    // between cyan and magenta
    const h = randInRange(180, 300);
    const s = randInRange(50, 100);
    const l = randInRange(50, 100);
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  private createStars(state: GameState) {
    const length = this.stars.length;
    const amount = this.howManyParticles - length;
    const started = length > 0;
    for (let i = 0; i < amount; i++) {
      this.stars.push(
        new Star({
          color: this.genColor(),
          position: {
            x: randInRange(0, state.worldBoundaries.width),
            y: started ? 0 : randInRange(0, state.worldBoundaries.height),
          },
          radius: randInRange(0.15, 0.85),
          speed: randInRange(0.1, 5),
          glowSpeed: randInRange(1000, 2000),
        })
      );
    }
  }

  public update(state: GameState) {
    let actives: Star[] = [];
    iterate(this.stars, (star) => {
      star.update(state);
      if (star.isActive) actives.push(star);
    });
    this.stars = actives;
    this.createStars(state);
  }

  public draw(c: CanvasRenderingContext2D): void {
    iterate(this.stars, (star) => star.draw(c));
  }
}
