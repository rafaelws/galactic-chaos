import { ListenerMap, readEvent, set, unset } from "@/common/events";
import {
  ControlAction,
  InputHandler,
  Joystick,
  KeyboardAndMouse,
} from "@/common/controls";
import { GameEvent } from "@/objects";
import { setup } from "@/main/loop";

const elements = {
  playerHp: "player-hp",
  bossHp: "boss-hp",
  pauseMenu: "pause-menu",
  mainMenu: "main-menu",
  gameOverMenu: "game-over-menu",
  loading: "loading",
};

function changeDisplay(elId: string, visible = true): void {
  document.getElementById(elId)!.style.display = visible ? "block" : "none";
}
const show = (elId: string) => changeDisplay(elId, true);
const hide = (elId: string) => changeDisplay(elId, false);

function hideAll() {
  hide(elements.loading);
  hide(elements.bossHp);
  hide(elements.playerHp);
  hide(elements.pauseMenu);
  hide(elements.gameOverMenu);
  hide(elements.mainMenu);
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
      const hit =
        km.getState()[input.action]?.active ||
        gp.getState()[input.action]?.active;

      if (hit) {
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
  paused ? show(elements.pauseMenu) : hide(elements.pauseMenu);
}

function gameOver() {
  readInput([
    { action: "START", fn: start },
    { action: "SELECT", fn: quit },
  ]);
  show(elements.gameOverMenu);
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
