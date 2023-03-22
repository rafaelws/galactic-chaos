import { ListenerMap, readEvent, set, trigger, unset } from "@/common/events";
import { GameEvent } from "@/objects";
import { setup } from "@/main/loop";
import { assets, preloadAudio } from "@/common/asset";
import { readInput } from "./readInput";
import { throttle } from "@/common/util";
import { hide, show } from "./util";
import { Options } from "./options";
import { AudioManager } from "@/main/AudioManager";

export namespace UI {
  const loop = setup();

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

  function hideAll() {
    Options.close();
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

    AudioManager.pause();

    show(elements.pauseMenu);
    Options.open();

    // FIXME
    // this timeout is required due to the gamepad
    // being waaaaay to fast (and caused a pause loop)
    setTimeout(() => {
      readInput([
        { action: "SELECT", fn: quit },
        {
          action: "START",
          fn: () => {
            trigger(GameEvent.pause, false);

            AudioManager.resume();

            hide(elements.pauseMenu);
            Options.close();
          },
        },
        ...Options.actions,
      ]);
    }, 350);
  }

  function gameOver() {
    AudioManager.play(assets.audio.menu.gameOver, true);

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

  export async function mainMenu() {
    await Promise.all(
      preloadAudio([
        assets.audio.menu.main,
        assets.audio.menu.pause,
        assets.audio.menu.gameOver,
      ])
    );
    hide(elements.loading);
    AudioManager.play(assets.audio.menu.main);

    readInput([
      { action: "START", fn: start },
      { action: "SELECT", fn: throttle(Options.toggle), destroy: false },
      ...Options.actions,
    ]);
    show(elements.mainMenu);
  }
}
