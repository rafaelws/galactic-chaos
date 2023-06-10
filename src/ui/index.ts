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
      events.game.onLoading(loading),
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

  function clear() {
    pauseInput?.destroy();
    unsubscribe();
    loop.destroy();
    hideAll();
  }

  function quit() {
    clear();
    mainMenu();
  }

  function loading(isLoading: boolean) {
    if (isLoading) show(elements.loading);
    else hide(elements.loading);
  }

  function pause(paused: boolean) {
    if (!paused) return;

    pauseInput?.destroy();
    audioManager.pause();

    show(elements.pauseMenu);
    options.open();

    readInput([
      { action: "SELECT", fn: quit },
      {
        action: "START",
        fn: () => {
          events.game.pause(false);
          audioManager.resume();

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
      pauseInput = readInput([{
        action: "START",
        fn: debounce(() => events.game.pause(true), debounceTime),
      }]);
    }, 500);
  }

  function gameOver() {
    clear();
    audioManager.play({
      assetPath: assets.audio.menu.gameOver,
      loop: true,
    });
    readInput([
      { action: "START", fn: debounce(start, debounceTime) },
      { action: "SELECT", fn: debounce(quit, debounceTime) },
    ]);
    show(elements.gameOverMenu);
  }

  function gameEnd() {
    clear();
    readInput([
      { action: "START", fn: debounce(start, debounceTime) },
      { action: "SELECT", fn: debounce(quit, debounceTime) },
    ]);
    show(elements.gameEndMenu);
  }

  function start() {
    clear();
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
    audioManager.play({ assetPath: assets.audio.menu.main });
    readInput([
      { action: "START", fn: debounce(start, debounceTime) },
      { action: "SELECT", fn: throttle(options.toggle), destroyOnHit: false },
      ...options.actions,
    ]);
    hide(elements.loading);
    show(elements.mainMenu);
    show(elements.ghLink);
  }

  return { mainMenu };
}
