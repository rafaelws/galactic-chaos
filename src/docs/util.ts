import { assets } from "@/core/asset";

type Assets = Record<string, string[]>;

export function getAssets(): Assets {
  return {
    Ship: [
      ...assets.img.ship.level1.slice(0, 2),
      ...assets.img.ship.level2.slice(0, 2),
      ...assets.img.ship.level3.slice(0, 2),
      ...assets.img.ship.level4.slice(0, 2),
    ],
    Rock: [
      ...assets.img.rock.brown,
      ...assets.img.rock.grey,
      ...assets.img.rock.giant,
    ],
    Boss: [
      assets.img.ship.level1[2],
      assets.img.ship.level2[2],
      assets.img.ship.level3[2],
      assets.img.ship.level4[2],
      assets.img.ship.final,
    ],
  };
}

export function raf(cb: (delta: number) => void) {
  let lts = 0;
  let delta = 0;
  let handle: number | null = null;
  function loop(ts: DOMHighResTimeStamp) {
    delta = ts - lts;
    lts = ts;
    if (delta > 0) cb(delta);
    handle = requestAnimationFrame(loop);
  }
  loop(0);
  return () => handle && cancelAnimationFrame(handle);
}

export function $$<T extends HTMLElement>(query: string) {
  return document.querySelectorAll<T>(query)!;
}

export function $<T extends HTMLElement>(query: string) {
  return document.querySelector<T>(query)!;
}

export function $on(eventName: string, listener: Listener, el: HTMLElement) {
  el.addEventListener(eventName, listener);
}

export function $off(eventName: string, listener: Listener, el: HTMLElement) {
  el.removeEventListener(eventName, listener);
}

type Listener = (ev: globalThis.Event) => void;
type StringMap = Record<string, string>;

function translateCss(css: StringMap) {
  let style = "";
  for (const key in css) {
    style += `${key}:${css[key]};`;
  }
  return style;
}

export interface $El {
  className?: string[];
  children?: HTMLElement[] | string[];
  css?: StringMap;
  data?: StringMap;
  attributes?: StringMap;
  // TODO listeners
}

export function $el(tag: string, $el?: $El) {
  const el = document.createElement(tag);

  if (!$el) return el;

  const { className, children, css, data, attributes } = $el;
  if (className) el.classList.add(...className);
  if (children) el.append(...children);
  if (css) el.style.cssText = translateCss(css);
  if (data) {
    for (const key in data) {
      el.dataset[key] = data[key];
    }
  }
  if (attributes) {
    for (const attr in attributes) {
      el.setAttribute(attr, attributes[attr]);
    }
  }
  return el;
}
