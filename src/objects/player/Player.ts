import { atan2, hasCollided, toDeg } from "@/common/math";
import { iterate } from "@/common/util";
import { Boundaries, Coordinate, GameState } from "@/common/meta";
import {
  ControlState,
  ControlStateData,
  ControlAction,
} from "@/common/controls";
import { Projectile } from "@/objects";
import { Clock, GameObject } from "../shared";
import { PlayerParams } from "./PlayerParams";

export class Player extends GameObject {
  private maxHp = 10;

  private rotationAngle = 0;
  private startingProportions: Coordinate = { x: 0.5, y: 0.95 };

  private firePower = 1;
  private fireTimeout = 300; //ms
  private fireClock: Clock;

  private controls: ControlState = {};
  private projectiles: Projectile[] = [];

  constructor(private readonly params: PlayerParams) {
    super(params);
    this.hp = params.hp || this.maxHp;
    this.setDimensions(params.img);
    this.fireClock = new Clock(this.fireTimeout, true);
  }

  public set controlState(controls: ControlState) {
    this.controls = controls;
  }

  protected setStartingPoint(worldBoundaries: Boundaries) {
    const { x, y } = this.startingProportions;
    this.x = worldBoundaries.width * x - this.cx; // centered
    this.y = worldBoundaries.height * y - this.height; // 5% above ground
  }

  private setRotation(velocity: number, to?: Coordinate) {
    if (to) {
      // mouse: rotates from the center of the player
      this.rotationAngle = -atan2(this.hitbox, to);
    } else {
      // -1 <= velocity <= 1
      // TODO rotationSpeed for the gamepad
      this.rotationAngle += toDeg(velocity);
    }
  }

  private fire() {
    if (this.fireClock.pending) return;

    this.fireClock.reset();
    this.projectiles.push(
      new Projectile({
        enemy: false,
        impact: {
          power: this.firePower,
        },
        movement: {
          angle: this.rotationAngle,
          start: this.hitbox,
        },
      })
    );
  }

  public checkCollisions(gameObject: GameObject) {
    if (gameObject.isActive && hasCollided(this.hitbox, gameObject.hitbox)) {
      console.log("player => object hit");
      const impactPower = gameObject.handleImpact(this.firePower);
      this.handleHit(impactPower);
    }

    iterate(this.projectiles, (p) => {
      if (p.isActive && hasCollided(p.hitbox, gameObject.hitbox)) {
        console.log("projectile => object hit");
        gameObject.handleHit(this.firePower);
        p.handleHit(this.firePower);
      }
    });
  }

  private act(
    state: GameState,
    action: ControlAction,
    control: ControlStateData
  ) {
    if (!control.active) return;

    const rate = control.rate || 1;
    // TODO modulate velocity
    const velocity = rate * state.delta * 0.5;

    // prettier-ignore
    switch (action) {
      case "L_UP": this.y -= velocity; break;
      case "L_DOWN": this.y += velocity; break;
      case "L_LEFT": this.x -= velocity; break;
      case "L_RIGHT": this.x += velocity; break;
      case "ROTATE": this.setRotation(velocity, control.coordinate); break;
      case "RB": this.fire(); break;
    }

    // stay inbounds
    if (this.y < 0) this.y = 0;
    if (this.y + this.height > state.worldBoundaries.height)
      this.y = state.worldBoundaries.height - this.height;
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > state.worldBoundaries.width)
      this.x = state.worldBoundaries.width - this.width;
  }

  public update(state: GameState): void {
    super.update(state);
    if (this.fireClock.pending) this.fireClock.increment(state.delta);

    const keys = Object.keys(this.controls) as ControlAction[];
    iterate(keys, (action) => {
      this.act(state, action, this.controls[action]!);
    });

    // IMPORTANT
    state.player = this.hitbox;
    iterate(this.projectiles, (p) => p.update(state));
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (!this.ready) return;
    iterate(this.projectiles, (p) => p.draw(c));
    c.save();
    c.translate(this.x + this.cx, this.y + this.cy);
    c.rotate(this.rotationAngle);
    c.drawImage(this.params.img, -this.cx, -this.cy, this.width, this.height);
    c.restore();
    if (this.debug) this.drawDebug(c);
  }
}
