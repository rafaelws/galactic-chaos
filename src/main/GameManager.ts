import { set, unset, trigger, ListenerMap } from "@/common/events";
import { KeyboardAndMouse, InputHandler } from "@/common/controls";
import { Destroyable } from "@/common/meta";
import { CanvasManager } from "./CanvasManager";
import { LevelManager } from "@/level";
import { hud } from "@/hud";
import { Clock } from "@/common";
import { GameEvent } from "@/objects";

export class GameManager implements Destroyable {
  private cm: CanvasManager;
  private lm: LevelManager;
  private input: InputHandler;

  private paused = false;
  private pauseClock: Clock;

  private listeners: ListenerMap = {};
  private destroyables: Destroyable[] = [];

  constructor() {
    this.cm = new CanvasManager();
    this.lm = new LevelManager();

    // TODO test interval with gamepad
    this.pauseClock = new Clock(250, true);

    // TODO controls will be either gamepad or keyboard/mouse
    this.input = new KeyboardAndMouse();

    this.listeners = { pause: this.handlePause.bind(this) };
    set(this.listeners);
    this.destroyables = [hud(), this.input, this.cm, this.lm];
  }

  private handlePause(ev: Event) {
    this.paused = (ev as CustomEvent).detail;
  }

  public destroy() {
    unset(this.listeners);
    for (let target of this.destroyables) target.destroy();
  }

  private update(delta: number) {
    this.pauseClock.increment(delta);

    const controls = this.input.getState();

    if (!this.pauseClock.pending && controls.START?.active) {
      this.paused = !this.paused;
      trigger(GameEvent.pause, this.paused);
      this.pauseClock.reset();
    }

    if (this.paused) {
      if (controls.SELECT?.active) {
        trigger(GameEvent.quit);
      }
      return;
    }
    this.lm.update(delta, this.cm.getBoundaries(), controls);
  }

  private draw() {
    if (this.paused) return;
    this.cm.clear();
    this.lm.draw(this.cm.context);
  }

  public nextFrame(delta: number) {
    this.update(delta);
    this.draw();
  }

  /*
  private _debug() {
    const { width, height } = worldBoundaries;
    const lines = [
      `${width}x${height}`,
      `${Math.floor(1000 / delta)}fps`,
      `${Math.floor(delta)}ms`,
    ];
    c.fillStyle = "white";
    c.strokeStyle = "white";
    c.font = `${16}px sans-serif`;
    c.fillText(lines.join(", "), 5, 16);
  }
  */
}
