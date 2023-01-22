import { ControlState } from "@/common/controls";
import { Boundaries, Coordinate, Drawable, GameState } from "@/common/meta";
import { Projectile } from "..";

export class ProjectileManager implements Drawable {
  private readonly projectileInterval = 100; // ms
  private projectileLastLaunch = 0;
  private projectiles: Projectile[] = [];

  public launch(from: Coordinate, angle: number, worldBoundaries: Boundaries) {
    const now = Date.now();
    if (now - this.projectileLastLaunch > this.projectileInterval) {
      this.projectileLastLaunch = now;

      const newProjectile = new Projectile(from, angle, worldBoundaries);
      this.projectiles.push(newProjectile);
    }
  }

  update(state: GameState, _: ControlState): void {
    this.projectiles = this.projectiles.filter((projectile) => {
      projectile.update(state, _);
      return projectile.isActive;
    });
  }

  draw(c: CanvasRenderingContext2D) {
    this.projectiles.forEach((projectile) => {
      projectile.draw(c);
    });
  }

  // TODO
  isActive(): boolean {
    return true;
  }
}
