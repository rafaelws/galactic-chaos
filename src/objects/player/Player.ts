import { atan2, toDeg } from "@/common/math";
import { iterate } from "@/common/util";
import { Coordinate, GameState, HitBox } from "@/common/meta";
import {
  ControlState,
  ControlStateData,
  ControlAction,
} from "@/common/controls";
import { ProjectileLauncher } from "../projectile";

export class Player {
  private x = NaN;
  private y = NaN;
  private cx = 0;
  private cy = 0;
  private width = 0;
  private height = 0;
  private rotationAngle = 0;
  private launcher: ProjectileLauncher;

  constructor(private img: HTMLImageElement) {
    this.launcher = new ProjectileLauncher();
    // TODO handle screen resize
    this.height = img.height;
    this.width = img.width;
    this.cx = this.width * 0.5;
    this.cy = this.height * 0.5;
  }

  private setRotation(velocity: number, to?: Coordinate) {
    if (to) {
      // mouse: rotates from the center of the player
      this.rotationAngle = -atan2(this.hitbox, to);
    } else {
      // -1 <= velocity <= 1
      // TODO rotationSpeed for the gamepad
      this.rotationAngle += toDeg(velocity);
    }
  }

  private act(
    gameState: GameState,
    action: ControlAction,
    controlState: ControlStateData
  ) {
    const { active, rate = 1, coordinate } = controlState;

    if (!active) return;

    const {
      worldBoundaries: { width, height },
      delta,
    } = gameState;

    const velocity = rate * delta * 0.5;

    // prettier-ignore
    switch (action) {
      case "L_UP": this.y -= velocity; break;
      case "L_DOWN": this.y += velocity; break;
      case "L_LEFT": this.x -= velocity; break;
      case "L_RIGHT": this.x += velocity; break;
      case "ROTATE": this.setRotation(velocity, coordinate); break;
      case "RB": 
        this.launcher.launch({
          from: this.hitbox,
          angle: this.rotationAngle,
          enemy: false,
        });
        break;
    }

    // TODO treat boundaries as a complete arc/circle
    // for boundaries: Math.max(height, width) = circunference diameter
    // for collisions: ?
    // 2. Out of Bounds
    if (this.y < 0) this.y = 0;
    if (this.y + this.height > height) this.y = height - this.height;
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > width) this.x = width - this.width;
  }

  public update(state: GameState, controls: ControlState): void {
    if (!state.worldBoundaries) return;

    // TODO
    if (isNaN(this.x) && isNaN(this.y)) {
      const { width, height } = state.worldBoundaries;
      this.x = width * 0.5 - this.width * 0.5; // centered
      this.y = height * 0.95 - this.height; // 5% above ground
    }

    let action: ControlAction;
    for (action in controls) {
      this.act(state, action, controls[action]!);
    }

    // IMPORTANT
    state.player = this.hitbox;
    iterate(this.launcher.drawables, (drawable) => drawable.update(state));
  }

  public draw(c: CanvasRenderingContext2D): void {
    iterate(this.launcher.drawables, (drawable) => drawable.draw(c));

    const { img, x, y, width, height, rotationAngle, cx, cy } = this;

    c.save();
    c.translate(x + cx, y + cy);
    c.rotate(rotationAngle);
    // c.fillStyle = "white";
    // c.fillRect(-cx, -cy, width, height);
    // c.closePath();
    c.drawImage(img, -cx, -cy, width, height);
    c.restore();

    /*
    // debug
    const _y = Math.floor(y);
    const _x = Math.floor(x);
    const rad = Math.floor(toDeg(rotationAngle));
    c.strokeStyle = "red";
    c.fillStyle = "white";
    c.font = `${16}px sans-serif`;

    // c.textAlign = "center";
    c.fillText(`[${_x}, ${_y}] ${rad}°`, _x + width, _y);

    c.beginPath();
    c.arc(hitbox.x, hitbox.y, hitbox.radius, 0, Math.PI * 2);
    c.stroke();
    */
  }

  public get hitbox(): HitBox {
    return { radius: this.cy, x: this.x + this.cx, y: this.y + this.cy };
  }

  public get projectiles() {
    return this.launcher.drawables;
  }
}
