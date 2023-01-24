import { trigger } from "@/common/events";
import { hasCollided } from "@/common/math";
import {
  Boundaries,
  Coordinate,
  GameObject,
  GameState,
  HitBox,
} from "@/common/meta";

export interface ProjectileParams {
  from: Coordinate;
  angle: number;
  enemy: boolean;
  power?: number;

  // "piercing projectile"
  // (projectile won't vanish on first hit, and will `hitAdainIn` until hp == 0)
  // integer > 0
  // hp?: number;

  // if projectile.hp > 0 will `hitAgainIn` ms
  // hitAgainIn?: number;
}

export class Projectile implements GameObject {
  private x = NaN;
  private y = NaN;
  private cx = 0;
  private cy = 0;
  private xDirection = 0;
  private yDirection = 0;

  private width = 0;
  private height = 0;
  private active = true;

  constructor(private readonly params: ProjectileParams) {
    this.xDirection = Math.sin(-params.angle);
    this.yDirection = Math.cos(-params.angle);
  }

  private setStartingPoint(worldBoundaries: Boundaries) {
    // TODO handle screen resize
    this.width = worldBoundaries.width * 0.0025;
    this.height = worldBoundaries.height * 0.05;

    this.cx = this.width * 0.5;
    this.cy = this.height * 0.5;

    this.x = this.params.from.x - this.cx;
    this.y = this.params.from.y - this.cy;
  }

  private move(state: GameState) {
    this.x = this.x - this.xDirection * state.delta;
    this.y = this.y - this.yDirection * state.delta;
  }

  public update(state: GameState) {
    if (!this.active) return;
    if (isNaN(this.x) && isNaN(this.y))
      this.setStartingPoint(state.worldBoundaries);

    this.move(state);
    this.checkBoundaries(state.worldBoundaries);
    this.checkCollision(state.player);
  }

  public draw(c: CanvasRenderingContext2D) {
    if (isNaN(this.x) || isNaN(this.y)) return;
    if (!this.active) return;

    const { cx, cy } = this;
    c.save();
    c.translate(this.x + cx, this.y + cy);
    c.rotate(this.params.angle);
    c.fillStyle = "blue";
    c.fillRect(-cx, -cy, this.width, this.height);
    c.restore();
  }

  private checkBoundaries(worldBoundaries: Boundaries) {
    if (
      this.x + this.width < 0 ||
      this.y + this.height < 0 ||
      this.x - this.width > worldBoundaries.width ||
      this.y - this.height > worldBoundaries.height
    ) {
      this.active = false;
    }
  }

  private checkCollision(player: HitBox) {
    if (this.active && this.params.enemy && hasCollided(this.hitbox, player)) {
      // TODO
      trigger("impact", this.power);
      this.active = false;
    }
  }

  public get power() {
    return this.params.power || 1;
  }

  public get isActive() {
    return this.active;
  }

  public get hitbox() {
    return { radius: this.cy, x: this.x + this.cx, y: this.y + this.cy };
  }

  public handleHit(power: number) {
    // will never happen for Enemy Projectile
    this.active = false;
  }
}
