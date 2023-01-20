import {
  toDeg,
  Boundaries,
  Coordinate,
  GameState,
  HitBox,
  PlayerStatus,
  ControlState,
  ControlStateData,
  ControlAction,
  Drawable,
} from "@/common";

import { draw } from "./drawer";
import { ProjectileManager } from "../projectile/ProjectileManager";

export class Player implements Drawable {
  private x: number = NaN;
  private y: number = NaN;
  private width: number = 0;
  private height: number = 0;
  private rotationAngle: number = 0;
  private projectileManager: ProjectileManager;

  constructor() {
    this.projectileManager = new ProjectileManager();
  }

  private getMiddle(): Coordinate {
    return {
      x: this.x + this.width * 0.5,
      y: this.y + this.height * 0.5,
    };
  }

  private setRotation(velocity: number, to?: Coordinate) {
    if (to) {
      // mouse: rotates from the center of the player
      const from = this.getMiddle();
      this.rotationAngle = -Math.atan2(from.x - to.x, from.y - to.y);
    } else {
      // -1 <= velocity <= 1
      // 0.01745 =~ Math.PI / 180
      // 0.25 = 25% of the intended velocity
      // this.rotationAngle += 0.01745 * velocity * 0.25;
      this.rotationAngle = this.rotationAngle + toDeg(velocity) * 0.25;
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
        this.projectileManager.launch(
          this.getMiddle(),
          this.rotationAngle,
          gameState.worldBoundaries
        );
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

  private getHitBox(): HitBox {
    return {
      // since height == width
      radius: this.height * 0.2,
      x: this.x + this.width * 0.5,
      y: this.y + this.height * 0.5,
    };
  }

  public getStatus(): PlayerStatus {
    const { x, y, width, height } = this;
    return {
      boundaries: {
        width,
        height,
      },
      position: {
        x,
        y,
      },
      hitbox: this.getHitBox(),
      rotation: this.rotationAngle,
    };
  }

  public update(state: GameState, controls: ControlState): void {
    if (!state.worldBoundaries) return;

    // TODO update width/height
    const { width, height } = state.worldBoundaries;
    this.width = height * 0.2;
    this.height = this.width;

    // TODO
    if (isNaN(this.x) && isNaN(this.y)) {
      this.x = width * 0.5 - this.width * 0.5; // centered
      this.y = height * 0.95 - this.height; // 5% above ground
    }

    let action: ControlAction;
    for (action in controls) {
      this.act(state, action, controls[action]!);
    }
    this.projectileManager.update(state, controls);
  }

  public draw(c: CanvasRenderingContext2D, state: GameState): void {
    draw(this.getStatus(), c, state);
    this.projectileManager.draw(c, state);
  }
}
