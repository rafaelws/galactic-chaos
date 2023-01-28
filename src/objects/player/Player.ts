import { atan2, toDeg } from "@/common/math";
import { iterate } from "@/common/util";
import {
  Boundaries,
  Coordinate,
  Destroyable,
  GameState,
  HitBox,
} from "@/common/meta";
import {
  ControlState,
  ControlStateData,
  ControlAction,
} from "@/common/controls";
import { PlayerParams } from "./PlayerParams";
import { ListenerMap, set, unset } from "@/common/events";
import { Clock, GameObject } from "../shared";

export class Player extends GameObject implements Destroyable {
  private controls: ControlState = {};

  // private firePower = 1;
  private fireTimeout = 300; //ms
  private fireClock: Clock;

  private maxHp = 10;

  private rotationAngle = 0;
  private startingProportions: Coordinate = { x: 0.5, y: 0.95 };

  private listeners: ListenerMap = {};

  public set controlState(controls: ControlState) {
    this.controls = controls;
  }

  constructor(private readonly params: PlayerParams) {
    super(params);
    this.hp = params.hp || this.maxHp;
    this.setDimensions(params.img);
    this.setupListeners();

    this.fireClock = new Clock(this.fireTimeout, true);
  }

  private setupListeners() {
    this.listeners = { impact: this.hitEvent.bind(this) };
    set(this.listeners);
  }

  public destroy() {
    unset(this.listeners);
  }

  private hitEvent(ev: Event) {
    const power = (ev as CustomEvent).detail as number;
    console.log("player hit", power);
    this.hp -= power;
    if (this.hp <= 0) {
      console.log("game over");
      // trigger('gameover')
    }
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

    // TODO trigger('player-projectile', ProjectileParams)
    /*
    const projectile = new Projectile({
      enemy: false,
      power: this.firePower,
      movement: {
        angle: this.rotationAngle,
        start: this.hitbox,
      },
    });
    */
    // this.projectiles.push(projectile);
    this.fireClock.reset();
  }

  // not needed
  protected checkCollision(_: HitBox): void {}
  public handleHit(_: number): void {}

  private act(
    gameState: GameState,
    action: ControlAction,
    controlState: ControlStateData
  ) {
    const { active, rate = 1, coordinate } = controlState;

    if (!active) return;

    const {
      worldBoundaries: { width, height },
      delta,
    } = gameState;

    const velocity = rate * delta * 0.5;

    // prettier-ignore
    switch (action) {
      case "L_UP": this.y -= velocity; break;
      case "L_DOWN": this.y += velocity; break;
      case "L_LEFT": this.x -= velocity; break;
      case "L_RIGHT": this.x += velocity; break;
      case "ROTATE": this.setRotation(velocity, coordinate); break;
      case "RB": this.fire(); break;
    }

    // stay inbounds
    if (this.y < 0) this.y = 0;
    if (this.y + this.height > height) this.y = height - this.height;
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > width) this.x = width - this.width;
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
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (!this.ready) return;
    const { x, y, width, height, rotationAngle, cx, cy } = this;

    c.save();
    c.translate(x + cx, y + cy);
    c.rotate(rotationAngle);
    c.drawImage(this.params.img, -cx, -cy, width, height);
    c.restore();

    if (this.debug) this.drawDebug(c);
  }
}
