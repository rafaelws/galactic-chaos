import { set, unset, trigger, ListenerMap } from "@/common/events";
import { KeyboardAndMouse, InputHandler } from "@/common/controls";
import { Destroyable } from "@/common/meta";
import { CanvasManager } from "./CanvasManager";
import { LevelManager } from "@/level";
import { hud } from "@/hud";

// const debug = import.meta.env.VITE_DEBUG || true;

export class GameManager implements Destroyable {
  private cm: CanvasManager;
  private lm: LevelManager;
  private input: InputHandler;

  private started = false;
  private paused = false;

  private listeners: ListenerMap = {};
  private destroyables: Destroyable[] = [];

  constructor() {
    this.cm = new CanvasManager();
    this.lm = new LevelManager();

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
    if (this.paused) return;

    const controls = this.input.getState();

    // TODO start || esc
    if (controls.START?.active) {
      trigger("pause", true);
      // this.paused = true;
    }

    this.lm.update(delta, this.cm.getBoundaries(), controls);
  }

  private draw() {
    this.cm.clear();
    this.lm.draw(this.cm.context);
  }

  public nextFrame(delta: number) {
    if (!this.started) this.started = true;
    if (this.paused) return;

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
