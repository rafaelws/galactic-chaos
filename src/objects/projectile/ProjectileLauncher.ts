import { Drawable } from "@/common/meta";
import { iterate } from "@/common/util";
import { Projectile, ProjectileParams } from "./Projectile";

export class ProjectileLauncher {
  private lastTry = -1;

  constructor(private delay = 300) {}

  private projectiles: Projectile[] = [];

  public launch(params: ProjectileParams): void {
    const now = Date.now();
    if (now - this.lastTry > this.delay) {
      this.projectiles.push(new Projectile(params));
      this.lastTry = now;
    }
  }

  public get drawables(): Drawable[] {
    let actives: Projectile[] = [];
    iterate(this.projectiles, (projectile) => {
      if (projectile.isActive) actives.push(projectile);
    });
    this.projectiles = actives;
    return this.projectiles;
  }

  public setDelay(delay: number): void {
    this.delay = delay;
  }
}
