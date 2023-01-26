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
import { Projectile } from "../projectile";
import { ShipFire, ShipImpact, ShipMovement, ShipParams } from "./ShipParams";

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

  // TODO (refac)
  // private movement: Concrete<ShipMovement>;

  private hp: number;

  private impact: Concrete<ShipImpact>;
  private lastImpact = -1;

  private fire: Concrete<ShipFire>;
  private lastFire = -1;
  private projectiles: Projectile[] = [];

  private debug = false;

  constructor(private readonly params: ShipParams) {
    this.hp = this.params.hp || 1;

    this.impact = {
      power: 1,
      resistance: 0,
      collisionTimeout: 100,
      ...params.impact,
    };

    this.fire = {
      rate: 0,
      power: 1,
      precision: "SIMPLE",
      ...params.fire,
      angle: params.fire.angle ? toRad(params.fire.angle) : R180,
    };

    this.setDimensions();
    this.setStartingMovement(params.movement);
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

  private setRotation(hitbox: HitBox) {
    if (this.fire.rate === 0) return;

    switch (this.fire.precision) {
      case "SIMPLE":
        this.rotation = this.fire.angle;
        break;
      case "LOOSE":
      case "ACCURATE":
        this.rotation = this.calculateRotation(hitbox);
        break;
    }
  }

  private setFire(delta: number) {
    const { rate } = this.fire;
    if (rate === 0) return;

    if (this.lastFire < rate) {
      this.lastFire += delta;
    } else {
      this.shoot();
      this.lastFire = 0;
    }
  }

  private shoot() {
    let angle = 0;
    const { precision } = this.fire;

    if (precision === "ACCURATE") {
      angle = this.rotation;
    } else if (precision === "LOOSE") {
      angle = this.rotation + randInRange(-0.25, 0.25);
    } else {
      // SIMPLE
      angle = this.fire.angle;
    }

    this.projectiles.push(
      new Projectile({
        angle,
        enemy: true,
        from: this.hitbox,
        power: this.fire.power,
      })
    );
  }

  public update(state: GameState): void {
    this.debug = state.debug;
    if (this.isWaiting) {
      this.delay += state.delta;
      return;
    }

    if (isNaN(this.x) && isNaN(this.y))
      this.setStartingPoint(state.worldBoundaries);

    this.setRotation(state.player);
    this.setFire(state.delta);
    this.move(state);

    this.checkBoundaries(state.worldBoundaries);
    this.hitClock(state.delta);
    this.checkCollision(state.player);

    iterate(this.projectiles, (p) => p.update(state));
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (isNaN(this.x) || isNaN(this.y)) return;
    if (this.isWaiting) return;

    iterate(this.projectiles, (p) => p.draw(c));

    const { width, height, x, y, cx, cy } = this;

    c.save();
    c.translate(x + cx, y + cy);
    if (!!this.rotation) {
      c.rotate(this.rotation - R180);
    }
    c.drawImage(this.params.img, -cx, -cy, width, height);
    c.restore();
    if (this.debug) this._debug(c);
  }

  private _debug(c: CanvasRenderingContext2D) {
    const _y = Math.floor(this.y);
    const _x = Math.floor(this.x);
    const rad = Math.floor(this.rotation);
    c.strokeStyle = "red";
    c.fillStyle = "white";
    c.font = `${16}px sans-serif`;

    // c.textAlign = "center";
    c.fillText(`[${_x}, ${_y}] ${rad}°`, _x + this.width, _y);

    c.beginPath();
    c.arc(this.hitbox.x, this.hitbox.y, this.hitbox.radius, 0, Math.PI * 2);
    c.stroke();
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

    if (this.lastImpact >= this.impact.collisionTimeout) {
      this.lastImpact = -1;
    } else if (this.lastImpact > -1) {
      this.lastImpact += delta;
    }
  }

  private checkCollision(player: HitBox) {
    if (this.active && hasCollided(this.hitbox, player)) {
      const { power, resistance } = this.impact;
      trigger("impact", power);
      this.handleHit(power - resistance);
      this.lastImpact = 1; // activates hitClock()
    }
  }

  public handleHit(power: number): void {
    this.hp -= power;
    if (this.hp <= 0) this.active = false;
  }

  private get canHit() {
    return this.lastImpact === -1;
  }

  public get isActive() {
    // FIXME this.launcher.drawables.length > 0
    return this.active;
  }

  public get hitbox() {
    return { radius: this.cy, x: this.x + this.cx, y: this.y + this.cy };
  }
}
