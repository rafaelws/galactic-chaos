import { Boundaries, HitBox, Point } from "@/common/meta";
import { GameObject } from "./shared";
import { iterate } from "@/common/util";
import { point, toRad } from "@/common/math";

export class Radar {
  private factor = 0.1;
  private finalAngle = toRad(360);

  private world: Boundaries = { width: NaN, height: NaN };
  private gameObjects: GameObject[] = [];

  public update(gameObjects: GameObject[], world: Boundaries): void {
    this.gameObjects = gameObjects;
    this.world = world;
  }

  private drawGrid(
    { x, y }: Point,
    { width, height }: Boundaries,
    c: CanvasRenderingContext2D
  ) {
    const mx = x + width;
    const my = y + height;
    const cx = x + width * 0.5;
    const cy = y + height * 0.5;

    c.fillRect(x, y, width, height);
    c.strokeRect(x, y, width, height);

    c.beginPath();
    c.lineTo(cx, y);
    c.lineTo(cx, my);
    c.stroke();
    c.closePath();

    c.beginPath();
    c.lineTo(x, cy);
    c.lineTo(mx, cy);
    c.stroke();
    c.closePath();

    [0.333, 0.666].forEach((value) => {
      const p = point.lerp({ x, y }, { x: mx, y: my }, value * 0.5);
      const b: Boundaries = {
        width: width - width * value,
        height: height - height * value,
      };
      c.strokeRect(p.x, p.y, b.width, b.height);
    });
  }

  private canDrawObject(
    { x, y }: Point,
    { width, height }: Boundaries,
    hitbox: HitBox
  ) {
    const radius = hitbox.radius * 0.5;
    return (
      hitbox.x - radius > x &&
      hitbox.y - radius > y &&
      hitbox.x + radius < x + width &&
      hitbox.y + radius < y + height
    );
  }

  private drawObjects(
    { x, y }: Point,
    { width, height }: Boundaries,
    c: CanvasRenderingContext2D
  ) {
    // TODO blink objects?
    c.fillStyle = "rgba(255, 255, 255, 0.5)";
    iterate(this.gameObjects, ({ hitbox }) => {
      const render: HitBox = {
        x: x + hitbox.x * this.factor,
        y: y + hitbox.y * this.factor,
        radius: hitbox.radius * this.factor,
      };
      if (!this.canDrawObject({ x, y }, { width, height }, render)) return;
      c.arc(render.x, render.y, render.radius, 0, this.finalAngle);
      c.fill();
      c.closePath();
    });
  }

  public draw(c: CanvasRenderingContext2D): void {
    if (!this.world.width || !this.world.height) return;

    const width = this.world.width * this.factor;
    const height = this.world.height * this.factor;
    const x = this.world.width - width - 8;
    const y = this.world.height - height - 8;

    c.save();
    c.fillStyle = "rgba(48, 178, 233, 0.5)";
    c.strokeStyle = "rgba(255, 255, 255, 0.35)";
    this.drawGrid({ x, y }, { width, height }, c);
    this.drawObjects({ x, y }, { width, height }, c);
    c.restore();
  }
}
