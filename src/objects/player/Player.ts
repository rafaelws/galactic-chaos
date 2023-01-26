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
import { Projectile } from "../projectile";
import { ListenerMap, set, unset } from "@/common/events";

export class Player implements Destroyable {
  private x = NaN;
  private y = NaN;
  private cx = 0;
  private cy = 0;
  private width = 0;
  private height = 0;
  private rotationAngle = 0;

  private projectiles: Projectile[] = [];
  private fireTimeout = 300; //ms
  private firePower = 1;
  private lastHit = -1; //ms ago

  private hp = 0;

  private debug = false;
  private listeners: ListenerMap = {};

  constructor(private readonly params: PlayerParams) {
    this.hp = params.hp || 10;
    this.setDimensions();
    this.setupListeners();
  }

  private setupListeners() {
    this.listeners = { impact: this.handleHit.bind(this) };
    set(this.listeners);
  }

  private setDimensions() {
    // TODO handle screen resize
    this.height = this.params.img.height;
    this.width = this.params.img.width;
    this.cx = this.width * 0.5;
    this.cy = this.height * 0.5;
  }

  private setStartingPoint(worldBoundaries: Boundaries) {
    let [x, y] = [this.params.start?.x || 0.5, this.params.start?.y || 0.95];
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

  public update(state: GameState, controls: ControlState): void {
    this.debug = state.debug;
    if (!state.worldBoundaries) return;

    this.hitClock(state.delta);

    if (isNaN(this.x) && isNaN(this.y))
      this.setStartingPoint(state.worldBoundaries);

    let action: ControlAction;
    for (action in controls) {
      this.act(state, action, controls[action]!);
    }

    // IMPORTANT
    state.player = this.hitbox;
    iterate(this.projectiles, (p) => p.update(state));
    this.projectiles = this.projectiles.filter((p) => p.isActive);
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (isNaN(this.x) || isNaN(this.y)) return;
    iterate(this.projectiles, (p) => p.draw(c));

    const { x, y, width, height, rotationAngle, cx, cy } = this;

    c.save();
    c.translate(x + cx, y + cy);
    c.rotate(rotationAngle);
    c.drawImage(this.params.img, -cx, -cy, width, height);
    c.restore();

    if (this.debug) this._debug(c);
  }

  private _debug(c: CanvasRenderingContext2D) {
    const _y = Math.floor(this.y);
    const _x = Math.floor(this.x);
    const rad = Math.floor(toDeg(this.rotationAngle));
    c.strokeStyle = "red";
    c.fillStyle = "white";
    c.font = `${16}px sans-serif`;

    // c.textAlign = "center";
    c.fillText(`[${_x}, ${_y}] ${rad}°`, _x + this.width, _y);

    c.beginPath();
    c.arc(this.hitbox.x, this.hitbox.y, this.hitbox.radius, 0, Math.PI * 2);
    c.stroke();
  }

  private fire() {
    if (!this.canHit) return;

    this.projectiles.push(
      new Projectile({
        angle: this.rotationAngle,
        enemy: false,
        from: this.hitbox,
        power: this.firePower,
      })
    );
    this.lastHit = 1; // activates hitClock()
  }

  private get canHit() {
    return this.lastHit === -1;
  }

  private hitClock(delta: number) {
    if (this.canHit) return;

    if (this.lastHit >= this.fireTimeout) {
      this.lastHit = -1;
    } else if (this.lastHit > -1) {
      this.lastHit += delta;
    }
  }

  private handleHit(ev: Event) {
    const power = (ev as CustomEvent).detail as number;
    console.log("player hit", power);
    this.hp -= power;
    if (this.hp <= 0) {
      console.log("game over");
      // trigger('gameover')
    }
  }

  public get hitbox(): HitBox {
    return { radius: this.cy, x: this.x + this.cx, y: this.y + this.cy };
  }

  public destroy() {
    unset(this.listeners);
  }

  public getProjectiles() {
    return this.projectiles;
  }
}
