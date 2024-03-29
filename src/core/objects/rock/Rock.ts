import { GameObjectName } from "@/core/debug";
import { toRad } from "@/core/math";
import { GameState } from "@/core/meta";

import { Effect, EffectType, GameObject, Impact, Movement } from "../shared";
import { RockParams } from "./RockParams";

export class Rock extends GameObject {
  private rotationSpeed: number;
  private movement: Movement | null = null;
  private impact: Impact;

  constructor(private readonly params: RockParams) {
    super(params);

    this.setDimensions(this.params.img);
    this.rotationSpeed = params.rotationSpeed || 0;
    this.impact = new Impact(params.impact);
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

    if (this.movement === null) {
      this.movement = new Movement(
        state.delta,
        state.worldBoundaries,
        this.dimensions,
        this.params.movement
      );
    }

    if (!this.hasPosition) this.position = this.movement.startPosition();

    this.impact.update(state.delta);

    this.rotation += toRad(this.rotationSpeed);
    this.position = this.movement.update();

    if (this.isOutbounds(state.worldBoundaries) || this.movement.ended) {
      this.active = false;
    }
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (!this.isReady) return;
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.rotation);
    c.drawImage(this.params.img, -this.cx, -this.cy, this.width, this.height);
    c.restore();
    this.drawDebug(c, GameObjectName.Rock);
  }
}
