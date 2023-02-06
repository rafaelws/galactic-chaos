import { ListenerMap, readEvent, set, unset } from "@/common/events";
import { InputHandler, Joystick, KeyboardAndMouse } from "@/common/controls";
import { GameEvent } from "@/objects";
import { setup } from "@/main/loop";

const elements = {
  playerHp: "player-hp",
  bossHp: "boss-hp",
  pauseMenu: "pause-menu",
  mainMenu: "main-menu",
  loading: "loading",
};

function changeDisplay(elId: string, visible = true): void {
  document.getElementById(elId)!.style.display = visible ? "block" : "none";
}
const show = (elId: string) => changeDisplay(elId, true);
const hide = (elId: string) => changeDisplay(elId, false);

const loop = setup();
const listeners: ListenerMap = {
  [GameEvent.quit]: quit,
  [GameEvent.pause]: pause,
};

function pause(ev: globalThis.Event) {
  const paused = readEvent<boolean>(ev);
  paused ? show(elements.pauseMenu) : hide(elements.pauseMenu);
}

function start() {
  set(listeners);
  loop.start();
}

function quit() {
  unset(listeners);
  loop.destroy();
  hide(elements.bossHp);
  hide(elements.playerHp);
  hide(elements.loading);
  hide(elements.pauseMenu);
  show(elements.mainMenu);
  mainMenu();
}

export function mainMenu() {
  const intervalTime = 250;
  const km: InputHandler = new KeyboardAndMouse();
  const gp: InputHandler = new Joystick();

  const interval = setInterval(() => {
    if (km.getState().START || gp.getState().START) {
      km.destroy();
      gp.destroy();
      clearInterval(interval);
      hide(elements.mainMenu);
      start();
    }
  }, intervalTime);
  hide(elements.loading);
  show(elements.mainMenu);
}
