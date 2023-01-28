import { trigger } from "@/common/events";
import { hasCollided, toRad } from "@/common/math";
import { GameState, HitBox } from "@/common/meta";
import { GameObject } from "../shared";
import { RockParams } from "./RockParams";

export class Rock extends GameObject {
  private selfRotation: number;

  constructor(private readonly params: RockParams) {
    super(params);
    this.selfRotation = params.selfRotation || 0;

    const { width, height } = this.params.img;
    this.setDimensions({ width, height });
    this.setDirection();
  }

  private setRotation() {
    this.rotation += this.selfRotation;
  }

  public handleHit(power: number): void {
    this.hp -= power;
    if (this.hp <= 0) this.active = false;
  }

  protected checkCollision(player: HitBox) {
    if (this.active && hasCollided(this.hitbox, player)) {
      const { power, resistance } = this.impact;
      trigger("impact", power);
      this.handleHit(power - resistance);
      this.impactClock.reset();
    }
  }

  public update(state: GameState): void {
    super.update(state);

    this.setRotation();
    this.move(state);

    if (this.isOutboundsDoubled(state.worldBoundaries)) this.active = false;
    if (!this.impactClock.pending) this.checkCollision(state.player);
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (!this.ready) return;

    const { width, height, x, y, cx, cy } = this;

    c.save();
    c.translate(x + cx, y + cy);
    c.rotate(toRad(this.rotation));
    c.drawImage(this.params.img, -cx, -cy, width, height);
    c.restore();

    if (this.debug) this.drawDebug(c);
  }
}
