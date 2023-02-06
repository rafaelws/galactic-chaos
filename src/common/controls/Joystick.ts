// WIP
// config 1: gamepad or keyboard/mouse (choose gamepad index)
// config 2: if controller disconnect:
//        A) go back to keyboard/mouse
//     or B) check for another controller before going to keyboard/mouse
// config 3: configure controller stick drift (individually; left and right)
// config 4: if gamepad unplugged,
//        A) go back to keyboard/mouse
//     or B) look for another avaliable gamepad (if none, do A)
// config 5: gamepad drift

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

// TODO
const drift = 0;

function isActive(button: GamepadButton) {
  return button.value > 0 || button.pressed;
}

function setState(state: ControlState, key: string, data: ControlStateData) {
  state[key as ControlAction] = data;
}

function query(gamepad: Gamepad): ControlState {
  let state: ControlState = {};

  const { buttons, axes } = gamepad;

  for (let i = 0; i < indexedButtons.length; ++i) {
    setState(state, indexedButtons[i], {
      active: isActive(buttons[i]),
      rate: buttons[i].value,
    });
  }

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
