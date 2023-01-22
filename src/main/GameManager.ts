import { set, unset, trigger, ListenerMap } from "@/common/events";
import { KeyboardAndMouse, InputHandler } from "@/common/controls";
import { GameState, Destroyable } from "@/common/meta";
import { CanvasManager } from "./CanvasManager";
import { globalDebug } from "./global-debug";
import { firstLevel, LevelManager } from "@/level";

// const debug = import.meta.env.VITE_DEBUG;
const debug = true;

export class GameManager implements Destroyable {
  private cm: CanvasManager;
  private lm: LevelManager;
  private input: InputHandler;

  private started = false;
  private paused = false;
  private gameState: GameState;

  private listeners: ListenerMap = {};
  private destroyables: Destroyable[] = [];

  constructor() {
    this.cm = new CanvasManager();
    this.lm = new LevelManager([firstLevel]);

    // TODO controls will be either gamepad or keyboard/mouse
    this.input = new KeyboardAndMouse();

    this.gameState = {
      debug,
      delta: 0,
      worldBoundaries: { width: 0, height: 0 },
    };

    this.listeners = { pause: this.handlePause.bind(this) };
    set(this.listeners);
    this.destroyables = [this.input, this.cm];
  }

  private handlePause(ev: Event) {
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

    this.lm.update(this.gameState, controls);
  }

  private draw() {
    this.cm.clear();

    // TODO draw level
    this.lm.draw(this.cm.context);

    if (this.gameState.debug)
      globalDebug(
        this.gameState.delta,
        this.cm.getBoundaries(),
        this.cm.context
      );
  }

  public nextFrame(delta: number) {
    if (!this.started) this.started = true;
    if (this.paused) return;

    this.update(delta);
    this.draw();
  }
}
