import { ListenerMap, set, unset } from "@/common/dom-events";
import { ControlAction, ControlState, InputHandler } from ".";

type ActionMap = { [key: string]: ControlAction };

const keyboardMap: ActionMap = {
  w: "L_UP",
  s: "L_DOWN",
  a: "L_LEFT",
  d: "L_RIGHT",
  arrowup: "L_UP",
  arrowdown: "L_DOWN",
  arrowleft: "L_LEFT",
  arrowright: "L_RIGHT",
  enter: "START",
  q: "SELECT",
};

export class KeyboardAndMouse implements InputHandler {
  public state: ControlState = {};
  public listeners: ListenerMap = {};

  constructor() {
    const keyboard = this.keyboardListener.bind(this);
    const mouse = this.mouseListener.bind(this);

    this.listeners = {
      keydown: keyboard,
      keyup: keyboard,
      mousemove: mouse,
      mouseup: mouse,
      mousedown: mouse,
    };
    set(this.listeners);
  }

  private keyboardListener(ev: globalThis.Event) {
    const keyEvent = ev as globalThis.KeyboardEvent;
    const key = keyEvent.key.toLowerCase();

    if (key in keyboardMap) {
      ev.preventDefault();
      this.state[keyboardMap[key]] = { active: ev.type == "keydown" };
    }
  }

  private mouseListener(event: globalThis.Event) {
    const ev = event as globalThis.MouseEvent;
    const { type } = ev;

    if (type == "mousemove") {
      this.state["ROTATE"] = {
        active: true,
        point: { x: ev.clientX, y: ev.clientY },
      };
    } else {
      // TODO should it be just RB or other 'key(s)'?
      const active = type == "mousedown" && ev.button === 0;
      this.state["RB"] = { active };
    }
  }

  public getState(): ControlState {
    return this.state;
  }

  public destroy() {
    unset(this.listeners);
  }
}
