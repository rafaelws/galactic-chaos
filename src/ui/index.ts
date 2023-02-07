import { ListenerMap, readEvent, set, trigger, unset } from "@/common/events";
import {
  ControlAction,
  InputHandler,
  Joystick,
  KeyboardAndMouse,
  PreferredInput,
} from "@/common/controls";
import { GameEvent } from "@/objects";
import { setup } from "@/main/loop";

const elements: { [index: string]: string } = {
  playerHp: "player-hp",
  bossHp: "boss-hp",
  pauseMenu: "pause-menu",
  mainMenu: "main-menu",
  gameOverMenu: "game-over-menu",
  gameEndMenu: "game-end-menu",
  loading: "loading",
};

function changeDisplay(elId: string, visible = true): void {
  document.getElementById(elId)!.style.display = visible ? "block" : "none";
}
const show = (elId: string) => changeDisplay(elId, true);
const hide = (elId: string) => changeDisplay(elId, false);

function hideAll() {
  for (const el in elements) {
    hide(elements[el]);
  }
}

type TriggerOnInput = {
  action: ControlAction;
  fn: () => void;
};

function readInput(inputs: TriggerOnInput[]) {
  const intervalTime = 50; // works better for gamepad
  const km: InputHandler = new KeyboardAndMouse();
  const gp: InputHandler = new Joystick();

  const interval = setInterval(() => {
    inputs.forEach((input) => {
      const joystickHit = gp.getState()[input.action]?.active;
      const keyboardHit = km.getState()[input.action]?.active;
      const hit = joystickHit || keyboardHit;

      if (hit) {
        sessionStorage.setItem(
          PreferredInput.Id,
          joystickHit
            ? PreferredInput.Joystick
            : PreferredInput.KeyboardAndMouse
        );
        km.destroy();
        gp.destroy();
        clearInterval(interval);
        input.fn();
      }
    });
  }, intervalTime);
}

const loop = setup();
const listeners: ListenerMap = {
  [GameEvent.quit]: quit,
  [GameEvent.pause]: pause,
  [GameEvent.gameOver]: gameOver,
  [GameEvent.gameEnd]: gameEnd,
};

function reset() {
  unset(listeners);
  loop.destroy();
  hideAll();
}

function quit() {
  reset();
  mainMenu();
}

function pause(ev: globalThis.Event) {
  const paused = readEvent<boolean>(ev);
  if (!paused) return;

  show(elements.pauseMenu);

  // this timeout is required because the gamepad
  // is waaaaay to fast (and caused a pause loop)
  setTimeout(() => {
    readInput([
      { action: "SELECT", fn: quit },
      {
        action: "START",
        fn: () => {
          trigger(GameEvent.pause, false);
          hide(elements.pauseMenu);
        },
      },
    ]);
  }, 350);
}

function gameOver() {
  hideAll();
  loop.destroy();
  readInput([
    { action: "START", fn: start },
    { action: "SELECT", fn: quit },
  ]);
  show(elements.gameOverMenu);
}

function gameEnd() {
  hideAll();
  loop.destroy();
  readInput([
    { action: "START", fn: start },
    { action: "SELECT", fn: quit },
  ]);
  show(elements.gameEndMenu);
}

function start() {
  reset();
  set(listeners);
  loop.start();
}

export function mainMenu() {
  hide(elements.loading);
  readInput([{ action: "START", fn: start }]);
  show(elements.mainMenu);
}
