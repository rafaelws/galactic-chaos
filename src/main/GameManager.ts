import { Destroyable } from "@/common/meta";
import { set, unset, trigger, ListenerMap, readEvent } from "@/common/events";
import { KeyboardAndMouse, InputHandler, Joystick } from "@/common/controls";
import { DebugParams, debugProfiles, NoDebug } from "@/common/debug";
import { CanvasManager } from "./CanvasManager";
import { LevelManager } from "@/level";
import { hud } from "@/hud";
import { Clock, Config } from "@/common";
import { GameEvent } from "@/objects";

const debug = NoDebug;
// const debug: DebugParams = {
//   entities: [...debugProfiles.Boss],
//   global: false,
//   hitboxes: true,
//   statusText: false,
//   trajectory: true,
// };

export class GameManager implements Destroyable {
  private cm: CanvasManager;
  private lm: LevelManager;
  private ih: InputHandler = new KeyboardAndMouse();
  private preferredInput = Config.Input.KeyboardAndMouse;

  private paused = false;
  private pauseClock: Clock;
  private startingPauseTime = 2000;
  private pauseTime = 350;

  private listeners: ListenerMap = {};
  private destroyables: Destroyable[] = [];

  constructor() {
    this.cm = new CanvasManager();
    this.lm = new LevelManager();

    // targetTime will change after the first interaction
    // required because the gamepad updates waaaay too fast.
    this.pauseClock = new Clock(this.startingPauseTime);

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
    for (let target of this.destroyables) target.destroy();
  }

  private checkPreferredInput() {
    const preferredInput = Config.get<Config.Input>(Config.Key.Input);

    if (preferredInput !== this.preferredInput) {
      this.ih.destroy();
      this.ih =
        preferredInput === Config.Input.Joystick
          ? new Joystick()
          : new KeyboardAndMouse();
      this.preferredInput = preferredInput;
    }
  }

  private update(delta: number) {
    const controls = this.ih.getState();

    // TODO improve pause throttling
    if (!this.pauseClock.pending && controls.START?.active) {
      if (this.pauseClock.targetTime === this.startingPauseTime) {
        this.pauseClock.targetTime = this.pauseTime;
      }

      trigger(GameEvent.pause, true);
      this.pauseClock.reset();
      return;
    }
    this.pauseClock.increment(delta);

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
    c.fillText(lines.join(", "), 5, 16);
  }
}
