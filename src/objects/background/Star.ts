import { Coordinate, Drawable, GameState } from "@/common/meta";

export interface StarParams {
  color: string;
  position: Coordinate;
  radius: number;
  speed: number;
}

export class Star implements Drawable {
  private x: number;
  private y: number;
  private height: number;
  private active: boolean = true;

  constructor(private params: StarParams) {
    this.x = params.position.x;
    this.y = params.position.y;
    this.height = params.radius * 2;
    this.y -= this.height;
  }

  public get isActive() {
    return this.active;
  }

  public update(state: GameState) {
    this.y += state.delta * this.params.speed * 0.03;
    this.active = this.y - this.height < state.worldBoundaries.height;
  }

  public draw(c: CanvasRenderingContext2D): void {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.params.radius, 0, Math.PI * 2, false);
    // FIXME harms overall performance
    // c.shadowColor = this.params.color;
    // c.shadowBlur = 15;
    c.fillStyle = this.params.color;
    c.fill();
    c.closePath();
    c.restore();
  }
}
