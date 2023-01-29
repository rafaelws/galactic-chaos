import { GameEvent, trigger } from "@/common/events";
import { R180, randInRange, toRad } from "@/common/math";
import { Concrete, GameState, HitBox } from "@/common/meta";
import { ProjectileParams, ShipParams } from "@/objects";
import { GameObject, Clock } from "../shared";
import { ShipFire } from "./ShipFireParams";

export class Ship extends GameObject {
  private fire: Concrete<ShipFire>;
  private fireClock: Clock;

  constructor(private readonly params: ShipParams) {
    super(params);

    this.fire = {
      rate: 0,
      power: 1,
      precision: "SIMPLE",
      ...params.fire,
      angle: params.fire?.angle ? toRad(params.fire.angle) : R180,
    };

    this.fireClock = new Clock(this.fire.rate, true);

    const { width, height } = this.params.img;
    this.setDimensions({ width, height });
    this.setDirection();
  }

  private setRotation(hitbox: HitBox) {
    if (this.fire.rate === 0) {
      this.rotation = R180;
      return;
    }

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
    if (this.fire.rate === 0) return;

    if (this.fireClock.pending) {
      this.fireClock.increment(delta);
    } else {
      this.shoot();
      this.fireClock.reset();
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

    const params: ProjectileParams = {
      enemy: true,
      movement: {
        angle: angle,
        start: this.hitbox,
      },
      impact: {
        power: this.fire.power,
      },
    };

    trigger(GameEvent.spawnEnemyProjectile, params);
  }

  public update(state: GameState): void {
    super.update(state);
    if (!this.ready) return;

    this.setRotation(state.player);
    this.setFire(state.delta);
    this.move(state);

    if (this.isOutboundsDoubled(state.worldBoundaries)) this.active = false;
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (!this.ready) return;
    c.save();
    c.translate(this.x + this.cx, this.y + this.cy);
    c.rotate(this.rotation - R180);
    c.drawImage(this.params.img, -this.cx, -this.cy, this.width, this.height);
    c.restore();
    if (this.debug) this.drawDebug(c);
  }
}
