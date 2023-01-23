import { ControlState } from "@/common/controls";
import { toRad } from "@/common/math";
import { Coordinate, Drawable, GameState } from "@/common/meta";

export interface RockParams {
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
   * velocity multiplier (0 to 1)
   */
  speed?: number;

  /**
   * to worldBoundaries.width (0 to 1)
   */
  // proportion?: number;

  rotation?: {
    direction: "CLOCKWISE" | "COUNTERCLOCKWISE";
    /**
     * rotation velocity multiplier (0 to 1)
     */
    speed: number;
  };
}

export class Rock implements Drawable {
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
  private speed = 0;
  private delay = 0;
  private rotation = 0;

  constructor(private readonly params: RockParams) {
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
  }

  public update(state: GameState, _: ControlState): void {
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

    this.x = this.x + this.xDirection * state.delta * this.speed;
    this.y = this.y + this.yDirection * state.delta * this.speed;

    if (!!this.params.rotation) {
      const { direction, speed } = this.params.rotation;
      if (direction === "CLOCKWISE") {
        this.rotation += speed;
      } else {
        this.rotation -= speed;
      }
    }

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
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (this.isWaiting()) return;
    const { width, height, x, y, cx, cy } = this;
    const { img, rotation } = this.params;

    c.save();
    c.translate(x + cx, y + cy);
    if (!!rotation) {
      c.rotate(toRad(this.rotation));
    }
    c.drawImage(img, -cx, -cy, width, height);
    c.restore();
  }

  private isWaiting() {
    return (this.params.delay || 0) >= this.delay;
  }

  public isActive(): boolean {
    return this.active;
  }
}
