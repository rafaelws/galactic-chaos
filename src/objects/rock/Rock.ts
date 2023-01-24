import { trigger } from "@/common/events";
import { hasCollided, toRad } from "@/common/math";
import {
  Boundaries,
  Concrete,
  GameObject,
  GameState,
  HitBox,
} from "@/common/meta";
import { RockImpact, RockParams } from "./RockParams";

export class Rock implements GameObject {
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

  private hp: number;
  private impact: Concrete<RockImpact>;
  private lastHit: number = -1;

  constructor(private readonly params: RockParams) {
    this.hp = params.hp || 1;
    this.impact = {
      power: 1,
      collisionTimeout: 100,
      resistance: 0,
      ...params.impact,
    };

    this.angle = toRad(params.angle || 0);
    this.speed = params.speed || 0.1;
    this.xDirection = Math.sin(-this.angle);
    this.yDirection = Math.cos(-this.angle);

    // TODO handle screen resize
    this.height = this.params.img.height;
    this.width = this.params.img.width;
    this.doubleHeight = this.height * 2;
    this.doubleWidth = this.width * 2;
    this.cx = this.width * 0.5;
    this.cy = this.height * 0.5;
  }

  private setStartingPoint(worldBoundaries: Boundaries) {
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
    this.x += x * worldBoundaries.width;
    this.y = y * worldBoundaries.height - this.height;
  }

  private move(state: GameState) {
    this.x = this.x + this.xDirection * state.delta * this.speed;
    this.y = this.y + this.yDirection * state.delta * this.speed;
  }

  private setRotation() {
    if (!!this.params.rotation) {
      const { direction, speed } = this.params.rotation;
      if (direction === "CLOCKWISE") {
        this.rotation += speed;
      } else {
        this.rotation -= speed;
      }
    }
  }

  public update(state: GameState): void {
    if (this.isWaiting) {
      this.delay += state.delta;
      return;
    }

    if (isNaN(this.x) && isNaN(this.y))
      this.setStartingPoint(state.worldBoundaries);

    this.move(state);
    this.setRotation();

    this.checkBoundaries(state.worldBoundaries);
    this.hitClock(state.delta);
    this.checkCollision(state.player);
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (isNaN(this.x) || isNaN(this.y)) return;
    if (this.isWaiting) return;

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

  private hitClock(delta: number) {
    if (this.canHit) return;

    if (this.lastHit >= this.impact.collisionTimeout) {
      this.lastHit = -1;
    } else if (this.lastHit > -1) {
      this.lastHit += delta;
    }
  }

  private checkCollision(player: HitBox) {
    if (this.active && this.canHit && hasCollided(this.hitbox, player)) {
      const { power, resistance } = this.impact;
      trigger("impact", power);
      this.handleHit(power - resistance);
      this.lastHit = 1; // activates hitClock()
    }
  }

  public handleHit(power: number): void {
    this.hp -= power;
    if (this.hp <= 0) this.active = false;
  }

  private get canHit() {
    return this.lastHit === -1;
  }

  public get isActive() {
    return this.active;
  }

  public get hitbox() {
    return { radius: this.cy, x: this.x + this.cx, y: this.y + this.cy };
  }
}
