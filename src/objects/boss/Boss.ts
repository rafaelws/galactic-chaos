import { trigger } from "@/common/events";
import { R180 } from "@/common/math";
import { GameState } from "@/common/meta";
import { iterate } from "@/common/util";
import {
  CyclicMovement,
  Effect,
  EffectType,
  Fire,
  GameEvent,
  GameObject,
  Impact,
} from "../shared";
import { BossParams } from "./BossParams";

export class Boss extends GameObject {
  private maxHp: number;

  private fire: Fire = new Fire();
  private impact: Impact = new Impact();
  private movement: CyclicMovement = new CyclicMovement();

  private currentPhase = -1;
  private finalPhase: number;

  constructor(private params: BossParams) {
    super(params);
    this.maxHp = params.hp || 30;
    this.finalPhase = params.phases.length;
    this.setDimensions(this.params.img);
    this.nextPhase();
    trigger(GameEvent.bossHp, { maxHp: this.maxHp, hp: this.hp });
  }

  private get phase() {
    return this.params.phases[this.currentPhase];
  }

  private get phaseParams() {
    return { hp: this.hp, maxHp: this.maxHp };
  }

  private nextPhase() {
    if (++this.currentPhase < this.finalPhase) {
      const { cyclicMovement, impact, fire, spawnables } = this.phase;
      this.movement = new CyclicMovement(cyclicMovement);
      this.movement.setDirection();
      this.impact = new Impact(impact);
      this.fire = new Fire(fire);

      if (!!spawnables) iterate(spawnables, (s) => trigger(GameEvent.spawn, s));
    } else {
      this.active = false;
    }
  }

  public handleEffect(effect: Effect): void {
    const { type, amount } = effect;
    if (type === EffectType.impact) {
      this.hpLoss(amount - this.impact.resistence);
    } else if (type === EffectType.projectile) {
      this.hpLoss(amount);
    }
    trigger(GameEvent.bossHp, { maxHp: this.maxHp, hp: this.hp });
  }

  public effect(): Effect {
    return {
      type: EffectType.impact,
      amount: this.impact.onImpact(),
    };
  }

  public update(state: GameState): void {
    super.update(state);
    this.impact.update(state.delta);

    if (this.phase.nextPhaseCondition(this.phaseParams)) {
      this.nextPhase();
    }

    const world = state.worldBoundaries;

    if (!this.hasPosition)
      this.position = this.movement.startPosition(this.dimensions, world);

    if (!this.isReady) return;

    this.rotation = this.fire.update(this.hitbox, state);
    this.position = this.movement.increment(this.position, state.delta);

    if (
      this.movement.update(
        this.position,
        world,
        this.isOutbounds(state.worldBoundaries, this.dimensions)
      )
    ) {
      this.position = this.movement.startPosition(this.dimensions, world);
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
