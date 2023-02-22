import { ListenerMap, readEvent, set, trigger, unset } from "@/common/events";
import { GameEvent } from "@/objects";
import { setup } from "@/main/loop";
import { AudioEvent, AudioManager } from "./AudioManager";
import { assets, preloadAudio } from "@/common/asset";
import { readInput } from "./readInput";

const pauseTimeout = 350;

const loop = setup();
let audioManager: AudioManager | null = null;

const listeners: ListenerMap = {
  [GameEvent.quit]: quit,
  [GameEvent.pause]: pause,
  [GameEvent.gameOver]: gameOver,
  [GameEvent.gameEnd]: gameEnd,
};

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

  trigger(AudioEvent.pause, {
    filePath: assets.audio.menu.pause,
    loop: true,
  });

  show(elements.pauseMenu);

  // this timeout is required due to the gamepad
  // being waaaaay to fast (and caused a pause loop)
  setTimeout(() => {
    readInput([
      { action: "SELECT", fn: quit },
      {
        action: "START",
        fn: () => {
          trigger(GameEvent.pause, false);
          trigger(AudioEvent.resume);
          hide(elements.pauseMenu);
        },
      },
    ]);
  }, pauseTimeout);
}

function gameOver() {
  trigger(AudioEvent.mainStream, {
    filePath: assets.audio.menu.gameOver,
    loop: true,
  });

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

function setupAudio() {
  if (!audioManager) audioManager = new AudioManager();

  return Promise.all(
    preloadAudio([
      assets.audio.menu.main,
      assets.audio.menu.pause,
      assets.audio.menu.gameOver,
    ])
  );
}

export async function mainMenu() {
  await setupAudio();
  hide(elements.loading);
  trigger(AudioEvent.mainStream, {
    filePath: assets.audio.menu.main,
  });
  readInput([{ action: "START", fn: start }]);
  show(elements.mainMenu);
}
