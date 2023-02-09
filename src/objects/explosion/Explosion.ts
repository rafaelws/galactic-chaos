import { toRad } from "@/common/math";
import { Drawable, GameState } from "@/common/meta";
import { iterate } from "@/common/util";
import { ExplosionProfile, explosionProfiles } from "./profiles";
import { ExplosionParams } from "./ExplosionParams";
import { ExplosionParticle } from "./ExplosionParticle";

export class Explosion implements Drawable {
  private particles: ExplosionParticle[] = [];
  private profile: ExplosionProfile;
  private howManyParticles: number;

  constructor(private params: ExplosionParams) {
    this.profile = explosionProfiles[params.profile];
    this.howManyParticles = this.profile.amount;
    this.createParticles();
  }

  public get isActive() {
    return this.particles.length > 0;
  }

  private createParticles() {
    const { x, y } = this.params.epicenter;
    const angleStep = 360 / this.howManyParticles;
    let degAngle = -angleStep;

    for (let i = 0; i < this.howManyParticles; i++) {
      degAngle += angleStep;

      this.particles.push(
        new ExplosionParticle({
          ...this.profile,
          angle: toRad(degAngle),
          epicenter: { x, y },
        })
      );
    }
  }

  public update(state: GameState): void {
    let actives: ExplosionParticle[] = [];
    iterate(this.particles, (p) => {
      p.update(state);
      if (p.isActive) actives.push(p);
    });
    this.particles = actives;
  }

  public draw(c: CanvasRenderingContext2D): void {
    iterate(this.particles, (p) => p.draw(c));
  }
}
