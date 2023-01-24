import { trigger } from "@/common/events";
import { atan2, hasCollided, R180, randInRange, toRad } from "@/common/math";
import {
  Boundaries,
  Concrete,
  GameObject,
  GameState,
  HitBox,
} from "@/common/meta";
import { iterate } from "@/common/util";
import { ProjectileLauncher } from "../projectile";
import { ShipImpact, ShipMovement, ShipParams } from "./ShipParams";

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

  private hp: number;
  private impact: Concrete<ShipImpact>;
  private lastHit = -1;

  constructor(private readonly params: ShipParams) {
    this.hp = this.params.hp || 1;
    this.impact = {
      power: 1,
      resistance: 0,
      collisionTimeout: 100,
      ...params.impact,
    };

    this.setDimensions();
    this.setStartingMovement(params.movement);
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

  private setStartingMovement(movement: ShipMovement) {
    const { angle = 0, speed = 0.1 } = movement;

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
    if (this.isWaiting) {
      this.delay += state.delta;
      return;
    }

    if (isNaN(this.x) && isNaN(this.y))
      this.setStartingPoint(state.worldBoundaries);

    this.setFireAndRotation(state);
    this.move(state);

    this.checkBoundaries(state.worldBoundaries);
    this.hitClock(state.delta);
    this.checkCollision(state.player);

    iterate(this.launcher.drawables, (drawable) => drawable.update(state));
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (isNaN(this.x) || isNaN(this.y)) return;
    if (this.isWaiting) return;

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

  private hitClock(delta: number) {
    if (this.canHit) return;

    if (this.lastHit >= this.impact.collisionTimeout) {
      this.lastHit = -1;
    } else if (this.lastHit > -1) {
      this.lastHit += delta;
    }
  }

  private checkCollision(player: HitBox) {
    if (this.active && hasCollided(this.hitbox, player)) {
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
    // || this.launcher.drawables.length > 0
    return this.active;
  }

  public get hitbox() {
    return { radius: this.cy, x: this.x + this.cx, y: this.y + this.cy };
  }
}
