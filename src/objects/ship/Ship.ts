import { trigger } from "@/common/events";
import { iterate } from "@/common/util";
import { hasCollided, R180, randInRange, toRad } from "@/common/math";
import { Concrete, GameState, HitBox } from "@/common/meta";
import { Projectile } from "@/objects";
import { GameObject, Clock } from "@/objects/shared";
import { ShipFire, ShipParams } from ".";

export class Ship extends GameObject {
  private fire: Concrete<ShipFire>;
  private fireClock: Clock;
  private projectiles: Projectile[] = [];

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

    // TODO trigger('enemy-projectile', ProjectileParams)
    this.projectiles.push(
      new Projectile({
        enemy: true,
        power: this.fire.power,
        movement: {
          angle: angle,
          start: this.hitbox,
        },
      })
    );
  }

  public handleHit(power: number): void {
    this.hp -= power;
    if (this.hp <= 0) this.active = false;
  }

  protected checkCollision(player: HitBox) {
    if (this.active && hasCollided(this.hitbox, player)) {
      const { power, resistance } = this.impact;
      trigger("impact", power);
      this.handleHit(power - resistance);
      this.impactClock.reset();
    }
  }

  public update(state: GameState): void {
    super.update(state);
    this.setRotation(state.player);
    this.setFire(state.delta);
    this.move(state);

    if (this.isOutboundsDoubled(state.worldBoundaries)) this.active = false;
    if (!this.impactClock.pending) this.checkCollision(state.player);

    iterate(this.projectiles, (p) => p.update(state));
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (!this.ready) return;
    iterate(this.projectiles, (p) => p.draw(c));

    const { width, height, x, y, cx, cy } = this;

    c.save();
    c.translate(x + cx, y + cy);
    c.rotate(this.rotation - R180);
    c.drawImage(this.params.img, -cx, -cy, width, height);
    c.restore();
    if (this.debug) this.drawDebug(c);
  }
}
