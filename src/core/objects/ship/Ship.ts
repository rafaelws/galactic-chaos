import { GameObjectName } from "@/core/debug";
import { R180 } from "@/core/math";
import { GameState } from "@/core/meta";
import { ShipParams } from "@/core/objects";

import {
  Effect,
  EffectType,
  Fire,
  GameObject,
  Impact,
  Movement,
} from "../shared";

export class Ship extends GameObject {
  private movement: Movement | null = null;
  private impact: Impact;
  private fire: Fire;

  constructor(private readonly params: ShipParams) {
    super(params);

    this.setDimensions(this.params.img);

    this.impact = new Impact(params.impact);
    this.fire = new Fire(params.fire);
  }

  public handleEffect(effect: Effect): void {
    const { type, amount } = effect;
    if (type === EffectType.Impact) {
      this.hpLoss(amount - this.impact.resistence);
    } else if (type === EffectType.Projectile) {
      this.hpLoss(amount);
    }
  }

  public effect(): Effect {
    return {
      type: EffectType.Impact,
      amount: this.impact.onImpact(),
    };
  }

  public update(state: GameState): void {
    super.update(state);
    if (!this.canSpawn) return;

    if (this.movement === null)
      this.movement = new Movement(
        state.delta,
        state.worldBoundaries,
        this.dimensions,
        this.params.movement
      );

    if (!this.hasPosition) this.position = this.movement.startPosition();

    this.impact.update(state.delta);

    this.rotation = this.fire.update(state.delta, state.player, this.hitbox);
    this.position = this.movement.update();

    if (this.isOutbounds(state.worldBoundaries) || this.movement.ended) {
      this.active = false;
    }
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (!this.isReady) return;
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.rotation - R180);
    c.drawImage(this.params.img, -this.cx, -this.cy, this.width, this.height);
    c.restore();
    this.drawDebug(c, GameObjectName.Ship);
  }
}
