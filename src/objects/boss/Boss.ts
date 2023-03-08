import { trigger } from "@/common/events";
import { R180 } from "@/common/math";
import { GameObjectName, GameState } from "@/common/meta";
import { iterate } from "@/common/util";
import {
  Effect,
  EffectType,
  Fire,
  GameEvent,
  GameObject,
  Impact,
  Movement,
} from "../shared";
import { BossParams } from "./BossParams";

export class Boss extends GameObject {
  private maxHp: number;

  private fire: Fire = new Fire();
  private impact: Impact = new Impact();
  private movement: Movement | null = null;

  private currentPhase = -1;
  private phasesLength: number;

  constructor(private params: BossParams) {
    super(params);
    this.maxHp = params.hp || 30;
    this.phasesLength = params.phases.length;
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
    if (++this.currentPhase < this.phasesLength) {
      const { impact, fire, spawnables } = this.phase;
      this.movement = null;
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

    if (this.phase.nextPhaseCondition(this.phaseParams)) this.nextPhase();

    if (this.movement === null) {
      this.movement = new Movement(
        state.delta,
        state.worldBoundaries,
        this.dimensions,
        {
          ...this.phase.movement,
          repeatable: true,
        }
      );
    }

    if (!this.hasPosition) this.position = this.movement.startPosition();
    if (!this.isReady) return;

    this.impact.update(state.delta);

    this.rotation = this.fire.update(state.delta, state.player, this.hitbox);
    this.position = this.movement.update();
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (!this.isReady) return;
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.rotation - R180);
    c.drawImage(this.params.img, -this.cx, -this.cy, this.width, this.height);
    c.restore();
    this.drawDebug(c, GameObjectName.Boss);
  }
}
