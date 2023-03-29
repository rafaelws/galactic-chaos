// TODO
// PreferredInput: gamepad or keyboard/mouse (choose gamepad index?)
// configure controller stick drift (left and right)
// if gamepad unplugged/disconnect,
//    A) look for another avaliable gamepad (if none, do A)
// or B) go back to keyboard/mouse

// TODO throttle function

import { ControlAction, ControlState, ControlStateData, InputHandler } from ".";
import { iterate } from "../util";

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

const drift = 0.1;

function isActive(button: GamepadButton) {
  return button.value > 0 || button.pressed;
}

function setState(state: ControlState, key: string, data: ControlStateData) {
  state[key as ControlAction] = data;
}

function query(gamepad: Gamepad): ControlState {
  let state: ControlState = {};

  const { buttons, axes } = gamepad;

  iterate(indexedButtons, (button, i) =>
    setState(state, button, {
      active: isActive(buttons[i]),
      rate: buttons[i].value,
    })
  );

  const [lh, lv, rh, rv] = axes;

  setState(state, "L_LEFT", {
    active: lh < -drift,
    rate: Math.abs(lh),
  });

  setState(state, "L_RIGHT", {
    active: lh > drift,
    rate: lh,
  });

  setState(state, "L_UP", {
    active: lv < -drift,
    rate: Math.abs(lv),
  });

  setState(state, "L_DOWN", {
    active: lv > drift,
    rate: lv,
  });

  setState(state, "R_LEFT", {
    active: rh < -drift,
    rate: Math.abs(rh),
  });

  setState(state, "R_RIGHT", {
    active: rh > drift,
    rate: rh,
  });

  setState(state, "R_UP", {
    active: rv < -drift,
    rate: Math.abs(rv),
  });

  setState(state, "R_DOWN", {
    active: rv > drift,
    rate: rv,
  });

  // Custom event
  setState(state, "ROTATE", {
    active: -drift > rh || rh > drift,
    rate: rh,
  });

  return state;
}

export class Joystick implements InputHandler {
  public getState(): ControlState {
    const gamepad = navigator.getGamepads().find((pad) => !!pad);
    return gamepad ? query(gamepad) : {};
  }

  public destroy() {}
}
