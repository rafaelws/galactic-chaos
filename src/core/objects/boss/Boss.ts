import { GameObjectName } from "@/core/debug";
import { events } from "@/core/events";
import { lerp, R180 } from "@/core/math";
import { GameState } from "@/core/meta";
import { iterate } from "@/core/util";

import {
  Effect,
  EffectType,
  Fire,
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

  private alpha = 1;
  private alphaTime = 0;

  constructor(private params: BossParams) {
    super(params);
    this.maxHp = params.hp || 30;
    this.phasesLength = params.phases.length;
    this.setDimensions(this.params.img);
    this.nextPhase();
    events.game.bossHp({ maxHp: this.maxHp, hp: this.hp });
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
      this.impact = new Impact(impact);
      this.fire = new Fire(fire);

      this.movement = null;
      this.alphaTime = 0;
      this.alpha = 0.999;

      if (spawnables) iterate(spawnables, (s) => events.game.spawn(s));
    } else {
      this.active = false;
    }
  }

  public handleEffect(effect: Effect): void {
    const { type, amount } = effect;
    if (type === EffectType.Impact) {
      this.hpLoss(amount - this.impact.resistence);
    } else if (type === EffectType.Projectile) {
      this.hpLoss(amount);
    }
    events.game.bossHp({ maxHp: this.maxHp, hp: this.hp });
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

    if (this.phase.nextPhaseCondition(this.phaseParams)) this.nextPhase();

    if (this.alpha < 1) {
      this.alphaTime += state.delta * 0.001 + 0.05;
      this.alpha = lerp(1, 0, this.alphaTime);

      if (this.alphaTime >= 1) {
        this.alphaTime = 0;
        this.alpha = 1;
      } else {
        return;
      }
    }

    if (this.movement === null) {
      this.movement = new Movement(
        state.delta,
        state.worldBoundaries,
        this.dimensions,
        // TODO should be always repeatable?
        this.phase.movement
      );
      this.position = { x: NaN, y: NaN };
    }

    if (!this.hasPosition) {
      this.position = this.movement.startPosition();
      return;
    }

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
    if (this.alpha < 1) c.globalAlpha = this.alpha;
    c.drawImage(this.params.img, -this.cx, -this.cy, this.width, this.height);
    c.restore();
    this.drawDebug(c, GameObjectName.Boss);
  }
}
