import { R180, randInRange, toRad } from "@/common/math";
import { Coordinate, Drawable, GameState, HitBox } from "@/common/meta";
import { iterate } from "@/common/util";
import { ProjectileLauncher } from "../projectile";

export interface ShipParams {
  img: HTMLImageElement;

  /**
   * starting point in %
   * (0 <= x <= 1)
   * (0 <= y <= 1)
   *
   * Note: when setting y:
   *  - 0 is top, 1 is bottom
   *  - set `angle` accordingly (positive or negative)
   *  - set `x` to either 1 or 0
   */
  start: Coordinate;

  /**
   * spawn angle in degrees
   */
  angle?: number;

  /**
   * time in ms until draw (not precise, uses delta)
   */
  delay?: number;

  /**
   * velocity multiplier (0 < speed <= 1)
   */
  speed?: number;

  /**
   * 0 (or absent): won't fire
   */
  fireRate?: number;

  /**
   * SIMPLE: fire at `angle`
   * ACCURATE: fire directly at player
   * LOOSE: fire at player but w/ random deviation
   * default: SIMPLE (or none, if fireRate = 0)
   */
  aimPrecision?: "SIMPLE" | "LOOSE" | "ACCURATE";

  /**
   * SIN: move as a sine wave
   * COS: move as a cosine wave
   * LINAR: move as a rect
   * ARC: move as a arc
   * default: LINEAR
   */
  // moveSet?: "SIN" | "COS" | "ARC" | "LINEAR"

  /**
   * if true, doesn't exit the screen before being eliminated
   * default: false
   */
  // persistent: boolean
}

export class Ship implements Drawable {
  private active = true;
  private x = NaN;
  private y = NaN;
  private cx = 0;
  private cy = 0;
  private width = 0;
  private height = 0;
  private doubleWidth = 0;
  private doubleHeight = 0;

  private xDirection = 0;
  private yDirection = 0;
  private angle = 0;
  private rotation = 0;
  private speed = 0;
  private delay = 0;
  private fireRateDelay = 0;
  private launcher: ProjectileLauncher;

  constructor(private readonly params: ShipParams) {
    this.angle = toRad(params.angle || 0);
    this.xDirection = Math.sin(-this.angle);
    this.yDirection = Math.cos(-this.angle);
    this.speed = params.speed || 0.1;

    // TODO handle screen resize
    this.height = this.params.img.height;
    this.width = this.params.img.width;
    this.doubleHeight = this.height * 2;
    this.doubleWidth = this.width * 2;
    this.cx = this.width * 0.5;
    this.cy = this.height * 0.5;

    this.launcher = new ProjectileLauncher(params.fireRate);
  }

  public update(state: GameState): void {
    const { width: wwidth, height: wheight } = state.worldBoundaries;

    if (isNaN(this.x) && isNaN(this.y)) {
      let x = this.params.start.x;
      let y = this.params.start.y;

      this.x = 0;
      if (!!y) {
        if (this.angle > 0) {
          x = 1;
          this.x = this.width;
        } else if (this.angle < 0) {
          x = 0;
          this.x = -this.width;
        } else {
          y = 0;
        }
      }
      this.x += x * wwidth;
      this.y = y * wheight - this.height;
    }

    if (this.isWaiting()) {
      this.delay += state.delta;
      return;
    }

    const { fireRate = 0, aimPrecision = "SIMPLE" } = this.params;
    if (fireRate > 0) {
      let angle = R180;
      let rotation = R180;

      if (!!state.playerHitbox) {
        if (aimPrecision === "LOOSE") {
          rotation = this.calculateRotation(state.playerHitbox);
          angle = rotation + randInRange(-0.25, 0.25);
        } else if (aimPrecision === "ACCURATE") {
          angle = rotation = this.calculateRotation(state.playerHitbox);
        }
      }

      this.rotation = rotation;

      if (this.fireRateDelay < fireRate) {
        this.fireRateDelay += state.delta;
      } else {
        this.launcher.launch({
          from: {
            x: this.x + this.cx,
            y: this.y + this.cy,
          },
          angle,
          gameState: state,
        });
        this.fireRateDelay = 0;
      }
    }

    this.x = this.x + this.xDirection * state.delta * this.speed;
    this.y = this.y + this.yDirection * state.delta * this.speed;

    // TODO detect collision
    // detect out of bounds
    if (
      this.x + this.doubleWidth < 0 ||
      this.y + this.doubleHeight < 0 ||
      this.x - this.doubleWidth > wwidth ||
      this.y - this.doubleHeight > wheight
    ) {
      this.active = false;
    }

    iterate(this.launcher.drawables, (drawable) => drawable.update(state));
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (this.isWaiting()) return;

    iterate(this.launcher.drawables, (drawable) => drawable.draw(c));

    const { width, height, x, y, cx, cy } = this;

    c.save();
    c.translate(x + cx, y + cy);
    if (!!this.rotation) {
      c.rotate(this.rotation - R180);
    }
    c.drawImage(this.params.img, -cx, -cy, width, height);
    c.restore();
  }

  private isWaiting() {
    return (this.params.delay || 0) >= this.delay;
  }

  public isActive(): boolean {
    return this.active || this.launcher.drawables.length > 0;
  }

  private get middle(): Coordinate {
    return {
      x: this.x + this.cx,
      y: this.y + this.cy,
    };
  }

  private calculateRotation(hitbox: HitBox): number {
    return -Math.atan2(this.middle.x - hitbox.x, this.middle.y - hitbox.y);
  }
}
