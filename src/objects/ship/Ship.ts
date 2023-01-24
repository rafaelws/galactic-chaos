import { trigger } from "@/common/events";
import { atan2, hasCollided, R180, randInRange, toRad } from "@/common/math";
import {
  Boundaries,
  Coordinate,
  GameObject,
  GameState,
  HitBox,
} from "@/common/meta";
import { iterate } from "@/common/util";
import { ProjectileLauncher } from "../projectile";

export interface ShipParams {
  img: HTMLImageElement;

  /**
   * time in ms until draw (not precise, uses delta)
   */
  delay?: number;

  fire: {
    /**
     * 0 (or absent): won't fire
     */
    rate: number;

    /**
     * - SIMPLE: fire at `movement.angle`
     * - ACCURATE: fire directly at player
     * - LOOSE: fire at player but w/ random deviation
     * @default "SIMPLE" // (or none, if fireRate = 0)
     */
    precision?: "SIMPLE" | "LOOSE" | "ACCURATE";
  };

  movement: {
    /**
     * remember to:
     *  - spawn outside the canvas
     *  - set `movement.angle` accordingly (positive or negative)
     *  - `x` and `y` are decimals (0 <= `n` <= 1)
     *  - `x`: 0 is left, 1 is right
     *  - `y`: 0 is top, 1 is bottom
     *
     * When setting `y`:
     *  - `x` should be either 0 or 1
     *
     * When setting `x`:
     *  - `y` will ALWAYS be 0
     */
    start: Coordinate;

    /**
     * spawn angle in degrees
     * @default 0
     */
    angle: number;

    /**
     * velocity multiplier (`0 < speed <= 1`)
     * @default 0.1
     */
    speed?: number;

    /**
     * - `LINEAR`: move as a rect
     * - `ARC`: move as a arc
     * @default "LINEAR"
     */
    // pattern?: "LINEAR" | "8" | "ARC";
  };
}

export class Ship implements GameObject {
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
    this.setDimensions();
    this.setStartingMovement();
    this.launcher = new ProjectileLauncher(params.fire?.rate);
  }

  private setDimensions() {
    // TODO handle screen resize
    this.height = this.params.img.height;
    this.width = this.params.img.width;
    this.doubleHeight = this.height * 2;
    this.doubleWidth = this.width * 2;
    this.cx = this.width * 0.5;
    this.cy = this.height * 0.5;
  }

  private setStartingMovement() {
    const { angle = 0, speed = 0.1 } = this.params.movement;

    this.angle = toRad(angle);
    this.xDirection = Math.sin(-this.angle);
    this.yDirection = Math.cos(-this.angle);
    this.speed = speed;
  }

  private setStartingPoint(worldBoundaries: Boundaries) {
    let sx = this.params.movement.start.x;
    let sy = this.params.movement.start.y;

    this.x = 0;
    if (!!sy) {
      if (this.angle > 0) {
        sx = 1;
        this.x = this.width;
      } else if (this.angle < 0) {
        sx = 0;
        this.x = -this.width;
      } else {
        sy = 0;
      }
    }
    this.x += sx * (worldBoundaries.width - this.width);
    this.y = sy * (worldBoundaries.height - this.height);
  }

  private move(state: GameState) {
    // TODO patterns
    this.x = this.x + this.xDirection * this.speed * state.delta;
    this.y = this.y + this.yDirection * this.speed * state.delta;
  }

  private setFireAndRotation(state: GameState) {
    const { rate = 0, precision = "SIMPLE" } = this.params.fire;

    if (rate === 0) return;

    let angle = R180;
    let rotation = R180;

    if (precision === "LOOSE") {
      rotation = this.calculateRotation(state.player);
      angle = rotation + randInRange(-0.25, 0.25);
    } else if (precision === "ACCURATE") {
      angle = rotation = this.calculateRotation(state.player);
    }

    this.rotation = rotation;

    if (this.fireRateDelay < rate) {
      this.fireRateDelay += state.delta;
    } else {
      this.launcher.launch({
        from: this.hitbox,
        angle,
        enemy: true,
      });
      this.fireRateDelay = 0;
    }
  }

  public update(state: GameState): void {
    if (!this.active) return;
    if (this.isWaiting) {
      this.delay += state.delta;
      return;
    }

    if (isNaN(this.x) && isNaN(this.y))
      this.setStartingPoint(state.worldBoundaries);

    this.setFireAndRotation(state);
    this.move(state);

    this.checkBoundaries(state.worldBoundaries);
    this.checkCollision(state.player);

    iterate(this.launcher.drawables, (drawable) => drawable.update(state));
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (isNaN(this.x) || isNaN(this.y)) return;
    if (!this.active || this.isWaiting) return;

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

  private get isWaiting() {
    return (this.params.delay || 0) >= this.delay;
  }

  private checkBoundaries(worldBoundaries: Boundaries) {
    if (
      this.x + this.doubleWidth < 0 ||
      this.y + this.doubleHeight < 0 ||
      this.x - this.doubleWidth > worldBoundaries.width ||
      this.y - this.doubleHeight > worldBoundaries.height
    ) {
      this.active = false;
    }
  }

  private calculateRotation(hitbox: HitBox): number {
    const x = this.x + this.cx;
    const y = this.y + this.cy;
    return -atan2({ x, y }, hitbox);
  }

  private checkCollision(player: HitBox) {
    if (this.active && hasCollided(this.hitbox, player)) {
      // TODO params.impact.power
      trigger("impact", 1);
      // TODO change HP?
      this.active = false;
    }
  }

  public handleHit(power: number): void {
    // TODO hp
    this.active = false;
  }

  public get isActive() {
    return this.active || this.launcher.drawables.length > 0;
  }

  public get hitbox() {
    return { radius: this.cy, x: this.x + this.cx, y: this.y + this.cy };
  }
}
