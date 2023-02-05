import { R180 } from "@/common/math";
import { GameState } from "@/common/meta";
import { ShipParams } from "@/objects";
import { Effect, Fire, GameObject, Impact, Movement } from "../shared";

export class Ship extends GameObject {
  private movement: Movement;
  private impact: Impact;
  private fire: Fire;

  constructor(private readonly params: ShipParams) {
    super(params);

    this.setDimensions(this.params.img);

    this.movement = new Movement(params.movement);
    this.movement.setDirection();

    this.impact = new Impact(params.impact);

    this.fire = new Fire(params.fire);
  }

  public handleEffect(effect: Effect): void {
    const { type, amount } = effect;
    if (type === "IMPACT") {
      this.hpLoss(amount - this.impact.resistence);
    } else if (type === "PROJECTILE") {
      this.hpLoss(amount);
    }
  }

  public effect(): Effect {
    return {
      type: "IMPACT",
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

    this.rotation = this.fire.update(this.hitbox, state);
    this.position = this.movement.increment(this.position, state.delta);

    if (this.isOutbounds(state.worldBoundaries)) {
      this.active = false;
    }
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (!this.isReady) return;
    c.save();
    c.translate(this.x + this.cx, this.y + this.cy);
    c.rotate(this.rotation - R180);
    c.drawImage(this.params.img, -this.cx, -this.cy, this.width, this.height);
    c.restore();
    if (this.debug) this.drawDebug(c);
  }
}
