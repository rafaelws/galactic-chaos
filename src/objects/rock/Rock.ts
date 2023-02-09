import { toRad } from "@/common/math";
import { GameState } from "@/common/meta";
import { Effect, EffectType, GameObject, Impact, Movement } from "../shared";
import { RockParams } from "./RockParams";

export class Rock extends GameObject {
  private rotationSpeed: number;
  private movement: Movement;
  private impact: Impact;

  constructor(private readonly params: RockParams) {
    super(params);

    this.setDimensions(this.params.img);
    this.rotationSpeed = params.rotationSpeed || 0;

    this.movement = new Movement(params.movement);
    this.movement.setDirection();

    this.impact = new Impact(params.impact);
  }

  public handleEffect(effect: Effect): void {
    const { type, amount } = effect;
    if (type === EffectType.impact) {
      this.hpLoss(amount - this.impact.resistence);
    } else if (type === EffectType.projectile) {
      this.hpLoss(amount);
    }
  }

  public effect(): Effect {
    return {
      type: EffectType.impact,
      amount: this.impact.onImpact(),
    };
  }

  public update(state: GameState): void {
    super.update(state);
    if (!this.hasPosition)
      this.position = this.movement.startPosition(
        this.dimensions,
        state.worldBoundaries
      );
    if (!this.isReady) return;

    this.impact.update(state.delta);

    this.rotation += this.rotationSpeed;
    this.position = this.movement.increment(this.position, state.delta);

    if (this.isOutbounds(state.worldBoundaries)) {
      this.active = false;
    }
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (!this.isReady) return;
    c.save();
    c.translate(this.x + this.cx, this.y + this.cy);
    c.rotate(toRad(this.rotation));
    c.drawImage(this.params.img, -this.cx, -this.cy, this.width, this.height);
    c.restore();
    if (this.debug) this.drawDebug(c);
  }
}
