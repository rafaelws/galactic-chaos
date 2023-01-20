import {
  set,
  unset,
  trigger,
  ListenerMap,
  KeyboardAndMouse,
  Destroyable,
  GameState,
  InputHandler,
  Drawable,
} from "@/common";
import { Player } from "@/objects";

import { CanvasManager } from "./CanvasManager";

// const debug = import.meta.env.VITE_DEBUG;
const debug = true;

export class Manager implements Destroyable {
  private cm: CanvasManager;
  private input: InputHandler;

  private started = false;
  private paused = false;
  private gameState: GameState;
  private listeners: ListenerMap = {};

  private drawables: Drawable[] = [];
  private destroyables: Destroyable[] = [];

  constructor() {
    this.cm = new CanvasManager();
    // TODO controls will be either gamepad or keyboard/mouse
    this.input = new KeyboardAndMouse();

    this.gameState = {
      debug,
      delta: 0,
      worldBoundaries: { width: 0, height: 0 },
    };

    this.listeners = { pause: this.pause.bind(this) };
    set(this.listeners);
    this.destroyables = [this.input, this.cm];
  }

  private pause(ev: Event) {
    this.paused = (ev as CustomEvent).detail;
  }

  public destroy() {
    unset(this.listeners);
    for (let target of this.destroyables) target.destroy();
  }

  private setGameState(delta = 0) {
    this.gameState = {
      ...this.gameState,
      delta,
      worldBoundaries: this.cm.getBoundaries(),
    };
  }

  private update(delta: number) {
    if (this.paused) return;

    const controls = this.input.getState();

    if (controls.START?.active) {
      trigger("pause", true);
      // this.paused = true;
    }

    this.setGameState(delta);

    if (!this.started) {
      this.started = true;
      this.drawables = [new Player()];
    }

    // TODO event stream

    for (let i = 0; i < this.drawables.length; i++) {
      this.drawables[i].update(this.gameState, controls);
    }
  }

  private draw() {
    this.cm.clear();

    for (let i = 0; i < this.drawables.length; i++) {
      this.drawables[i].draw(this.cm.context, this.gameState);
    }

    if (this.gameState.debug) this.globalDebug();
  }

  public nextFrame(delta: number) {
    if (this.paused) return;

    this.update(delta);
    this.draw();
  }

  // TODO
  private globalDebug() {
    const { delta } = this.gameState;
    const { width, height } = this.cm.getBoundaries();
    const lines = [
      `${width}x${height}`,
      `${Math.floor(1000 / delta)}fps`,
      `${Math.floor(delta)}ms`,
    ];
    this.cm.context.strokeStyle = "white";
    this.cm.context.font = `${16}px sans-serif`;
    this.cm.context.fillText(lines.join(", "), 5, 16);
  }
}
