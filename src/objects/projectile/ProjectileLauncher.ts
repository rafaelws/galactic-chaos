import { Drawable } from "@/common/meta";
import { iterate } from "@/common/util";
import { Launcher, LaunchParams } from "./Launcher";
import { Projectile } from "./Projectile";

export class ProjectileLauncher implements Launcher {
  private lastTry = -1;

  constructor(private delay = 300) {}

  private projectiles: Projectile[] = [];

  public launch({
    from,
    angle,
    gameState: { worldBoundaries },
  }: LaunchParams): void {
    const now = Date.now();
    if (now - this.lastTry > this.delay) {
      this.projectiles.push(new Projectile(from, angle, worldBoundaries));
      this.lastTry = now;
    }
  }

  public get drawables(): Drawable[] {
    let actives: Projectile[] = [];
    iterate(this.projectiles, (projectile) => {
      if (projectile.isActive()) {
        actives.push(projectile);
      }
    });
    this.projectiles = actives;

    return this.projectiles;
  }

  public setDelay(delay: number): void {
    this.delay = delay;
  }
}
