import {
  CanvasManager,
  Config,
  ConfigInputType,
  ConfigKey,
  UnsubFn,
} from "@/core";
import { InputHandler, Joystick, KeyboardAndMouse } from "@/core/controls";
import { DebugParams, NoDebug } from "@/core/debug";
import { events } from "@/core/events";
import { Destroyable } from "@/core/meta";
import { iterate } from "@/core/util";
import { hud } from "@/game/ui/hud";

import { LevelManager } from "./LevelManager";

const debug: DebugParams = {
  ...NoDebug,
};

export class GameManager implements Destroyable {
  private cm: CanvasManager;
  private lm: LevelManager;
  private ih: InputHandler = new KeyboardAndMouse();
  private preferredInput = ConfigInputType.KeyboardAndMouse;

  private subscribers: UnsubFn[];
  private destroyables: Destroyable[];

  private paused = false;

  constructor() {
    this.cm = new CanvasManager();
    this.lm = new LevelManager();

    this.checkPreferredInput();

    this.subscribers = [
      events.game.onPause((paused) => {
        if (!paused) this.checkPreferredInput();
        this.paused = paused;
      }),
      events.config.onInput(() => {
        this.checkPreferredInput();
      }),
    ];
    // TODO test input handler destroyable after switch
    this.destroyables = [hud(), this.ih, this.cm, this.lm];
  }

  public destroy() {
    iterate(this.subscribers, (unsub) => unsub());
    iterate(this.destroyables, (target) => target.destroy());
  }

  private checkPreferredInput() {
    const preferredInput = Config.get<ConfigInputType>(ConfigKey.Input);

    if (preferredInput !== this.preferredInput) {
      this.ih.destroy();
      this.ih =
        preferredInput === ConfigInputType.Joystick
          ? new Joystick()
          : new KeyboardAndMouse();
      this.preferredInput = preferredInput;
    }
  }

  private update(delta: number) {
    const controls = this.ih.getState();
    this.lm.update(delta, this.cm.boundaries, controls, debug);
  }

  private draw() {
    this.cm.clear();
    this.lm.draw(this.cm.context);
  }

  public nextFrame(delta: number) {
    if (this.paused) return;
    this.update(delta);
    this.draw();
    this.debug(delta);
  }

  private debug(delta: number) {
    if (!debug.global) return;
    const c = this.cm.context;
    const { width, height } = this.cm.boundaries;
    const lines = [
      `${width}x${height}`,
      `${Math.floor(1000 / delta)}fps`,
      `${Math.floor(delta)}ms`,
    ];
    c.fillStyle = "white";
    c.strokeStyle = "white";
    c.font = `${16}px sans-serif`;

    const text = lines.join(", ");
    c.fillText(text, width - c.measureText(text).width - 5, height - 5);
  }
}
