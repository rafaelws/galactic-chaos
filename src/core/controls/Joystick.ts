import { Config, ConfigInputType, ConfigKey } from "../Config";
import { iterate } from "../util";
import { ControlAction, ControlState, ControlStateData, InputHandler } from ".";

const indexedButtons = [
  "A",
  "B",
  "X",
  "Y",
  "LB",
  "RB",
  "LT",
  "RT",
  "SELECT",
  "START",
  "L_CLICK",
  "R_CLICK",
  "D_UP",
  "D_DOWN",
  "D_LEFT",
  "D_RIGHT",
  "JOKER",
];

function query(gamepad: Gamepad): ControlState {
  const drift = 0.1;
  const state: ControlState = {};

  const setState = (key: string, data: ControlStateData) => {
    state[key as ControlAction] = data;
  };

  const isActive = (button: GamepadButton) =>
    button.value > 0 || button.pressed;

  const { buttons, axes } = gamepad;

  iterate(indexedButtons, (button, i) =>
    setState(button, {
      active: isActive(buttons[i]),
      rate: buttons[i].value,
    })
  );

  const [lh, lv, rh, rv] = axes;

  setState("L_LEFT", {
    active: lh < -drift,
    rate: Math.abs(lh),
  });

  setState("L_RIGHT", {
    active: lh > drift,
    rate: lh,
  });

  setState("L_UP", {
    active: lv < -drift,
    rate: Math.abs(lv),
  });

  setState("L_DOWN", {
    active: lv > drift,
    rate: lv,
  });

  setState("R_LEFT", {
    active: rh < -drift,
    rate: Math.abs(rh),
  });

  setState("R_RIGHT", {
    active: rh > drift,
    rate: rh,
  });

  setState("R_UP", {
    active: rv < -drift,
    rate: Math.abs(rv),
  });

  setState("R_DOWN", {
    active: rv > drift,
    rate: rv,
  });

  // Custom event
  setState("ROTATE", {
    active: -drift > rh || rh > drift,
    rate: rh,
  });

  return state;
}

export class Joystick implements InputHandler {
  private index = -1;

  private search(pads: (Gamepad | null)[]) {
    for (let i = 0; i < pads.length; i++) {
      if (pads[i]) {
        this.index = i;
        break;
      }
    }
  }

  public getState(): ControlState {
    let gamepad: Gamepad | null = null;
    const pads = navigator.getGamepads();

    if (this.index === -1) this.search(pads);
    gamepad = pads[this.index];

    if (gamepad) {
      return query(gamepad);
    } else {
      this.index = -1;
      Config.set(ConfigKey.Input, ConfigInputType.KeyboardAndMouse);
      return {};
    }
  }

  public destroy() {
    this.index = -1;
  }
}
