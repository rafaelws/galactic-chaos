import { Clock } from "@/common";
import { atan2, toRad } from "@/common/math";
import { iterate } from "@/common/util";
import { Boundaries, Coordinate, GameState } from "@/common/meta";
import {
  ControlState,
  ControlStateData,
  ControlAction,
} from "@/common/controls";
import { Projectile } from "@/objects";
import { Effect, EffectType, GameEvent, GameObject } from "../shared";
import { PlayerParams } from "./PlayerParams";
import { trigger } from "@/common/events";

export class Player extends GameObject {
  private maxHp = 10;

  private relativePosition: Coordinate = { x: 0.5, y: 0.95 };

  private power = 1;
  private fireTimeout = 300; //ms
  private fireClock: Clock;

  private controls: ControlState = {};
  private projectiles: Projectile[] = [];

  private damageLayers: {
    hp: number;
    img: HTMLImageElement;
  }[];

  constructor(private readonly params: PlayerParams) {
    super(params);
    this.hp = params.hp || this.maxHp;
    this.setDimensions(params.img);
    this.fireClock = new Clock(this.fireTimeout, true);

    this.damageLayers = [
      { hp: this.maxHp * 0.25, img: params.damageStages[2] },
      { hp: this.maxHp * 0.5, img: params.damageStages[1] },
      { hp: this.maxHp * 0.75, img: params.damageStages[0] },
    ];

    trigger(GameEvent.playerHp, { maxHp: this.maxHp, hp: this.hp });
  }

  public set controlState(controls: ControlState) {
    this.controls = controls;
  }

  public get ownProjectiles() {
    return this.projectiles;
  }

  protected startPosition(worldBoundaries: Boundaries): Coordinate {
    const { x, y } = this.relativePosition;
    return {
      x: worldBoundaries.width * x - this.cx, // centered
      y: worldBoundaries.height * y - this.height, // 5% above ground
    };
  }

  private setRotation(velocity: number, to?: Coordinate) {
    if (to) {
      // mouse: rotates from the center of the player
      this.rotation = -atan2(this.hitbox, to);
    } else {
      // -1 <= velocity <= 1
      // TODO implement rotationSpeed for the gamepad?
      // 0.01745 =~ Math.PI / 180
      // 0.25 = 25% of the intended velocity
      // this.rotationAngle += 0.01745 * velocity * 0.25;
      this.rotation += toRad(velocity);
    }
  }

  private fire() {
    if (this.fireClock.pending) return;
    this.fireClock.reset();

    this.projectiles.push(
      new Projectile({
        enemy: false,
        power: this.power,
        angle: this.rotation,
        start: this.hitbox,
      })
    );
  }

  public effect(): Effect {
    return {
      type: EffectType.impact,
      amount: this.power,
    };
  }

  public handleEffect(effect: Effect) {
    if (effect.type === EffectType.heal) {
      const hp = this.hp + effect.amount;
      this.hp = hp >= this.maxHp ? this.maxHp : hp;
    } else if (effect.type === EffectType.projectile) {
      this.hpLoss(effect.amount);
    }
    trigger(GameEvent.playerHp, { maxHp: this.maxHp, hp: this.hp });

    if (this.hp <= 0)
      trigger(GameEvent.gameOver, { maxHp: this.maxHp, hp: this.hp });
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

    if (!this.hasPosition)
      this.position = this.startPosition(state.worldBoundaries);

    this.fireClock.increment(state.delta);

    const keys = Object.keys(this.controls) as ControlAction[];
    iterate(keys, (action) => {
      this.act(state, action, this.controls[action]!);
    });

    // IMPORTANT
    state.player = this.hitbox;

    let actives: Projectile[] = [];
    iterate(this.projectiles, (p) => {
      p.update(state);
      if (p.isActive) actives.push(p);
    });
    this.projectiles = actives;
  }

  private drawDamageLayer(c: CanvasRenderingContext2D): void {
    for (let i = 0; i < this.damageLayers.length; i++) {
      const { img, hp } = this.damageLayers[i];
      if (this.hp <= hp) {
        c.drawImage(img, -this.cx, -this.cy, this.width, this.height);
        break;
      }
    }
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (!this.isReady) return;
    iterate(this.projectiles, (p) => p.draw(c));

    c.save();
    c.translate(this.x + this.cx, this.y + this.cy);
    c.rotate(this.rotation);
    c.drawImage(this.params.img, -this.cx, -this.cy, this.width, this.height);
    this.drawDamageLayer(c);
    c.restore();

    if (this.debug) this.drawDebug(c);
  }
}
