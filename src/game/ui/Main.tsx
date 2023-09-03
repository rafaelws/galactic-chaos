import debounce from "lodash.debounce";
import { createSignal, JSX, onCleanup, onMount, Show } from "solid-js";
import { Dynamic } from "solid-js/web";

import { UnsubFn } from "@/core";
import { hide, show } from "@/core/dom";
import { events } from "@/core/events";
import { Destroyable } from "@/core/meta";
import { throttle } from "@/core/util";

import { setup } from "../loop";
import {
  GameEndMenu,
  GameOverMenu,
  Hp,
  MainMenu,
  Options,
  PauseMenu,
} from "./components";
import { readInput } from "./readInput";

const debounceTime = 150;
const loop = setup();

const menus = ["main", "gameOver", "gameEnd", "none"] as const;
type MenuName = (typeof menus)[number];

const menuMap: Record<MenuName, () => JSX.Element> = {
  main: () => <MainMenu />,
  gameOver: () => <GameOverMenu />,
  gameEnd: () => <GameEndMenu />,
  none: () => null,
};

export function Main() {
  // TODO preload audio
  let pauseInput: Destroyable | null = null;
  const [isOptionsOpen, setOptionsOpen] = createSignal(false);
  const [isPauseMenuOpen, setPauseMenuOpen] = createSignal(false);

  const [menu, setMenu] = createSignal<MenuName>(menus[0]);

  function clear() {
    setOptionsOpen(false);
    setPauseMenuOpen(false);
    setMenu("none");
    pauseInput?.destroy();
    loop.destroy();
  }

  function quit() {
    clear();
    mainMenu();
  }

  function start() {
    clear();
    loop.start();
    hookPause();
  }

  function mainMenu() {
    show("#gh-link");
    // await Promise.all(
    //   preloadAudio(
    //     assets.audio.menu.main,
    //     assets.audio.menu.pause,
    //     assets.audio.menu.gameOver
    //   )
    // );
    // await audioManager.play({ assetPath: assets.audio.menu.main });
    readInput([
      {
        action: "START",
        fn: debounce(() => {
          hide("#gh-link");
          start();
        }, debounceTime),
      },
      {
        action: "SELECT",
        fn: throttle(() => setOptionsOpen((prev) => !prev)),
        destroyOnHit: false,
      },
    ]);
    setMenu("main");
  }

  function gameOver() {
    clear();
    // await audioManager.play({
    //   assetPath: assets.audio.menu.gameOver,
    //   loop: true,
    // });
    readInput([
      { action: "START", fn: debounce(start, debounceTime) },
      { action: "SELECT", fn: debounce(quit, debounceTime) },
    ]);
    setMenu("gameOver");
  }

  function gameEnd() {
    clear();
    readInput([
      { action: "START", fn: debounce(start, debounceTime) },
      { action: "SELECT", fn: debounce(quit, debounceTime) },
    ]);
    setMenu("gameEnd");
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

  function pause(paused: boolean) {
    if (!paused) return;

    pauseInput?.destroy();
    // await audioManager.pause();

    setPauseMenuOpen(true);
    setOptionsOpen(true);

    readInput([
      { action: "SELECT", fn: quit },
      {
        action: "START",
        fn: () => {
          setOptionsOpen(false);
          setPauseMenuOpen(false);
          events.game.pause(false);
          // await audioManager.resume();
          hookPause();
        },
      },
    ]);
  }

  function loading(isLoading: boolean) {
    isLoading ? show("#loading") : hide("#loading");
  }

  let subscribers: UnsubFn[] = [];

  onMount(() => {
    hide("#loading");
    subscribers = [
      events.game.onQuit(mainMenu),
      events.game.onPause(pause),
      events.game.onOver(gameOver),
      events.game.onEnd(gameEnd),
      events.game.onLoading(loading),
    ];
    mainMenu();
  });

  onCleanup(() => {
    subscribers.forEach((unsub) => unsub());
    pauseInput?.destroy();
  });

  return (
    <>
      <Show when={isOptionsOpen()}>
        <Options />
      </Show>
      <Show when={isPauseMenuOpen()}>
        <PauseMenu />
      </Show>
      <Dynamic component={menuMap[menu()]} />
      <Show when={menu() === "none"}>
        <Hp type="boss" />
        <Hp type="player" />
      </Show>
    </>
  );
}
