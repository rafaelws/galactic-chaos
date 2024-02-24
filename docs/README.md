# Galactic Chaos

!["banner"](./alt-banner.gif "banner")

A spaceship shooter game. 

[Play here.](https://rafaelws.github.io/galactic-chaos/)

# Getting started

```bash
# requires node (>=18)
npm i # install dependencies
npm run dev # run the development server (vite)

# to build and preview
npm run build # build the project to `/dist` (vite)
npm run preview # run the build task along with vite's built-in preview task

# to lint (eslint, tsc)
npm run lint
```

# CREDITS

[Image assets](https://www.kenney.nl/assets/space-shooter-redux) ([CC0](https://creativecommons.org/share-your-work/public-domain/cc0/)) by [Kenney.](https://www.kenney.nl/)

[Orbitron](https://fonts.google.com/specimen/Orbitron/about) Font ([OFL](https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL)) by [Matt McInerney](https://matt.cc/).

Music by me.

# LICENSE

This project is [MIT licensed](../LICENSE).

---

# About

Web game that uses APIs such as [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D), [Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) and [Gamepad](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API). No game engine was used.

## Structure

The entry point is [`Main.tsx`](../src/game/ui/Main.tsx) (note: refactored from vanilla js to [solidjs](https://solidjs.com/)). When the player starts the game, a loop is created using [`requestAnimationFrame()`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame).

Inside the game [loop](../src/game/loop.ts), a [GameManager](../src/game/GameManager.ts) is instantiated. It's a wrapper class that setups and manages input, canvas, pause state, and levels. It is also where the ["on screen debug"](#debug) is configured. 

Next, the [LevelManager](../src/game/LevelManager.ts) handles level loading, game state, and game objects.

A `Level` is simply an async function that returns an array of [GameObjects](../src/core/objects/shared/GameObject.ts).

## Input

The game supports input from both keyboard/mouse and [gamepad](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API). To consolidate the behavior regardless of the input source, a [common interface (InputHandler)](../src/core/controls/Input.ts) was created.

However, it's important to note that there are two main caveats:

1. The transition between gamepad and keyboard/mouse is not seamless. Moreover, one must first pause the game to make the switch.
2. The gameplay with the controller (gamepad) is not yet satisfactory.

How to switch inputs:
1. Switch from keyboard/mouse to gamepad: Pause using the keyboard, then resume using the gamepad.
2. Switch from gamepad to keyboard/mouse: Pause using the gamepad, then resume using the keyboard/mouse.

Additionally, the menus seamlessly respond to both inputs.

## Audio

The [WebAudio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) was used to play the background music. Due to most browsers having [autoplay policies](https://developer.chrome.com/blog/autoplay/#webaudio), the user is required to enable the audio using the menu.

## Movement

Movement might have been the most challenging feature to implement.

Even though [helper code was implemented](../src/core/objects/shared/movement/FluentMovement.ts), designing movement patterns for enemies relied heavily on mental abstraction. ~~The implementation of a preview GUI is strongly considered in the future~~. Check out the [playground](#playground).

### Lerp

> Note: Even though it is a "universally" known concept, I found it important to address it.

Lerp stands for linear interpolation.

```ts
function lerp(a: number, b: number, t: number) {
  return (1 - t) * a + t * b;
}
```

What I failed to understand at first:

> `t` should change, `a` and `b` should not.

Considerations:

- (Usually) The "progress" (`t`) changes over time.
- Since it's an `inter`polation, the `t` value ranges from 0 to 1 (0 is `a`, 1 is `b`).
- There's also something called `extra`polation, where `t` can be lower than 0 or higher than 1 (that way values can be projected before `a` - below 0 - and after `b` - above 1).
- You can "shape" the "progress" (`t`) using a ["shaping function."](https://easings.net/)

Usage A: In a scenario where an object's transparency needs to be progressively changed, lerp can be used to fade in and out of these states (opaque <> transparent).

Usage B: When an object needs to move from point `a` to point `b` in a straight line, the lerp function can calculate the intermediate steps between these two points.

```ts
interface Point {
  x: number;
  y: number;
}

function pointLerp(a: Point, b: Point, t: number): Point {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
  };
}
```

### Bezier

Lerp, on its own, takes care of linear movement (lines/rects). To achieve different movement patterns for the game mobs, quadratic and cubic bezier were introduced.

[There's an extensive video on the topic by Freya Holmér](https://youtu.be/aVwxzDHniEw).

## Debug

An "on-screen-debug" feature was implemented. There are options to show hitboxes, angles, positions, and trajectories (+filtering by game object/entity type).

!["on-screen-debug"](./debug-mode.gif "on-screen-debug")

## Playground

To get a glimpse of how things work behind the scenes, [you can visit the playground here](https://rafaelws.github.io/galactic-chaos/playground).

!["playground"](./playground.gif "playground")

---

# Known Issues

- Not supported (devices)
  - Smartphones, tablets, and smaller devices
  - Browsers that do not support JS modules (as of the publishing of this project, [most browsers support this feature](https://caniuse.com/es6-module))
- Screen resize: affects both overall dimensions and movement
  - Dimensions are set once per object. If the world boundaries change, rendered objects won't resize.
  - Movement is instantiated once per object. If the world boundaries, frame time (monitor frequency) or object dimensions change, moving objects will not behave as expected.
- Rarely, audio tracks can overlap each other (especially while exiting menus)