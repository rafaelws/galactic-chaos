import debounce from "lodash.debounce";
import { setup } from "@/main/loop";
import { Destroyable } from "@/common/meta";
import { UnsubFn } from "@/common";
import { events } from "@/common/events";
import { assets, preloadAudio, audioManager } from "@/common/asset";
import { throttle } from "@/common/util";
import { Options } from "./options";
import { readInput } from "./readInput";
import { hide, show } from "./util";

export function UI() {
  const loop = setup();
  const options = Options();

  const debounceTime = 150;
  let pauseInput: Destroyable | null = null;

  let subscribers: UnsubFn[] = [];

  const elements: { [index: string]: string } = {
    playerHp: "player-hp",
    bossHp: "boss-hp",
    pauseMenu: "pause-menu",
    mainMenu: "main-menu",
    gameOverMenu: "game-over-menu",
    gameEndMenu: "game-end-menu",
    loading: "loading",
    ghLink: "gh-link",
  };

  function subscribe() {
    if (subscribers.length > 0) unsubscribe();
    subscribers = [
      events.game.onQuit(quit),
      events.game.onPause(pause),
      events.game.onOver(gameOver),
      events.game.onEnd(gameEnd),
    ];
  }

  function unsubscribe() {
    subscribers.forEach(unsub => unsub());
    subscribers = [];
  }

  function hideAll() {
    options.close();
    for (const el in elements) {
      hide(elements[el]);
    }
  }

  function reset() {
    unsubscribe();
    loop.destroy();
    hideAll();
  }

  function quit() {
    reset();
    mainMenu();
  }

  async function pause(paused: boolean) {
    if (!paused) return;

    await audioManager.pause();

    show(elements.pauseMenu);
    options.open();

    readInput([
      { action: "SELECT", fn: quit },
      {
        action: "START",
        fn: async () => {
          events.game.pause(false);
          await audioManager.resume();

          hide(elements.pauseMenu);
          options.close();
          hookPause();
        },
      },
      ...options.actions,
    ]);
  }

  function hookPause() {
    setTimeout(() => {
      pauseInput = readInput([
        {
          action: "START",
          fn: debounce(() => events.game.pause(true), debounceTime),
        },
      ]);
    }, 500);
  }

  async function gameOver() {
    pauseInput?.destroy();
    await audioManager.play({
      assetPath: assets.audio.menu.gameOver,
      loop: true,
    });

    hideAll();
    loop.destroy();
    readInput([
      { action: "START", fn: debounce(start, debounceTime) },
      { action: "SELECT", fn: debounce(quit, debounceTime) },
    ]);
    show(elements.gameOverMenu);
  }

  function gameEnd() {
    pauseInput?.destroy();

    hideAll();
    loop.destroy();
    readInput([
      { action: "START", fn: debounce(start, debounceTime) },
      { action: "SELECT", fn: debounce(quit, debounceTime) },
    ]);
    show(elements.gameEndMenu);
  }

  function start() {
    reset();
    subscribe();
    loop.start();
    hookPause();
  }

  async function mainMenu() {
    await Promise.all(
      preloadAudio(
        assets.audio.menu.main,
        assets.audio.menu.pause,
        assets.audio.menu.gameOver
      )
    );
    hide(elements.loading);
    show(elements.ghLink);

    await audioManager.play({ assetPath: assets.audio.menu.main });

    readInput([
      { action: "START", fn: debounce(start, debounceTime) },
      { action: "SELECT", fn: throttle(options.toggle), destroyOnHit: false },
      ...options.actions,
    ]);
    show(elements.mainMenu);
  }

  return { mainMenu };
}
