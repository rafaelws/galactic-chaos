import { Destroyable } from "@/common/meta";
import { iterate } from "@/common/util";
import { set, unset, ListenerMap, readEvent } from "@/common/events";
import { KeyboardAndMouse, InputHandler, Joystick } from "@/common/controls";
import { DebugParams, NoDebug } from "@/common/debug";
import { LevelManager } from "@/level";
import { Config, ConfigInputType, ConfigKey } from "@/common";
import { hud } from "@/ui/hud";
import { CanvasManager } from "./CanvasManager";

const debug: DebugParams = {
  ...NoDebug,
};

export class GameManager implements Destroyable {
  private cm: CanvasManager;
  private lm: LevelManager;
  private ih: InputHandler = new KeyboardAndMouse();
  private preferredInput = ConfigInputType.KeyboardAndMouse;

  private listeners: ListenerMap = {};
  private destroyables: Destroyable[] = [];

  private paused = false;

  constructor() {
    this.cm = new CanvasManager();
    this.lm = new LevelManager();

    this.checkPreferredInput();

    this.listeners = {
      pause: (ev: globalThis.Event) => {
        const paused = readEvent<boolean>(ev);
        if (!paused) this.checkPreferredInput();
        this.paused = paused;
      },
    };
    set(this.listeners);
    // TODO test input handler destroyable after switch
    this.destroyables = [hud(), this.ih, this.cm, this.lm];
  }

  public destroy() {
    unset(this.listeners);
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
    this.lm.update(delta, this.cm.getBoundaries(), controls, debug);
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
    const { width, height } = this.cm.getBoundaries();
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
