import { Boundaries, Point, GameState, HitBox } from "@/common/meta";
import { GameObjectName } from "@/common/debug";
import { Effect, EffectType, GameObject } from "../shared";
import { ProjectileParams } from "./ProjectileParams";

export enum ProjectileColor {
  enemy = "rgb(172, 57, 57)",
  player = "rgb(48, 178, 233)",
}

export class Projectile extends GameObject {
  private color: string;
  private direction: Point = { x: 0, y: 0 };

  constructor(private readonly params: ProjectileParams) {
    super(params);
    this.rotation = params.angle;
    this.direction.x = Math.sin(-params.angle);
    this.direction.y = Math.cos(-params.angle);
    this.color = params.color
      ? params.color
      : params.enemy
      ? ProjectileColor.enemy
      : ProjectileColor.player;
  }

  public get hitbox(): HitBox {
    // palliative
    // FIXME should be a small arc at the very tip of the projectile
    return {
      ...super.hitbox,
      radius: this.cy * 0.5,
    };
  }

  protected startPoint(_: Boundaries): Point {
    // TODO rethink dimensions
    const width = 3.5;
    const height = 50;
    this.setDimensions({ width, height });
    return {
      x: this.params.start.x,
      y: this.params.start.y,
    };
  }

  private move(state: GameState) {
    this.x -= this.direction.x * state.delta;
    this.y -= this.direction.y * state.delta;
  }

  // TODO
  public handleEffect(effect: Effect): void {
    this.hpLoss(effect.amount);
  }

  public effect(): Effect {
    return {
      type: EffectType.Projectile,
      amount: this.params.power,
    };
  }

  public update(state: GameState) {
    super.update(state);

    if (!this.hasPosition)
      this.position = this.startPoint(state.worldBoundaries);

    if (!this.active) return;

    this.move(state);

    if (this.isOutbounds(state.worldBoundaries, this.dimensions)) {
      this.active = false;
    }
  }

  public draw(c: CanvasRenderingContext2D) {
    if (!this.active || !this.isReady) return;
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.rotation);
    c.fillStyle = this.color;
    c.fillRect(-this.cx, -this.cy, this.width, this.height);
    c.restore();
    this.drawDebug(
      c,
      this.params.enemy
        ? GameObjectName.EnemyProjectile
        : GameObjectName.PlayerProjectile
    );
  }
}
