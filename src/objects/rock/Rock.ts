import { toRad } from "@/common/math";
import { GameState } from "@/common/meta";
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

  public update(state: GameState): void {
    super.update(state);
    if (!this.isReady) return;

    this.setRotation();
    this.move(state);

    if (this.isOutboundsDoubled(state.worldBoundaries)) this.active = false;
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
