import debounce from "lodash.debounce";
import { setup } from "@/main/loop";
import { Destroyable } from "@/common/meta";
import { ListenerMap, readEvent, set, trigger, unset } from "@/common/events";
import { assets, preloadAudio } from "@/common/asset";
import { throttle } from "@/common/util";
import { AudioEvent } from "@/main/AudioManager";
import { GameEvent } from "@/objects";
import { Options } from "./options";
import { readInput } from "./readInput";
import { hide, show } from "./util";

export function UI() {
  // TODO await refactor + fixes
  // AudioManager();
  const loop = setup();
  const options = Options();

  const debounceTime = 150;
  let pauseInput: Destroyable | null = null;

  const listeners: ListenerMap = {
    [GameEvent.Quit]: quit,
    [GameEvent.Pause]: pause,
    [GameEvent.GameOver]: gameOver,
    [GameEvent.GameEnd]: gameEnd,
  };

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

  function hideAll() {
    options.close();
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

    trigger(AudioEvent.Pause);

    show(elements.pauseMenu);
    options.open();

    readInput([
      { action: "SELECT", fn: quit },
      {
        action: "START",
        fn: () => {
          trigger(GameEvent.Pause, false);
          trigger(AudioEvent.Resume);

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
          fn: debounce(() => trigger(GameEvent.Pause, true), debounceTime),
        },
      ]);
    }, 500);
  }

  function gameOver() {
    pauseInput?.destroy();
    trigger(AudioEvent.Play, {
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
    set(listeners);
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
    trigger(AudioEvent.Play, { assetPath: assets.audio.menu.main });

    readInput([
      { action: "START", fn: debounce(start, debounceTime) },
      { action: "SELECT", fn: throttle(options.toggle), destroyOnHit: false },
      ...options.actions,
    ]);
    show(elements.mainMenu);
  }

  return { mainMenu };
}
