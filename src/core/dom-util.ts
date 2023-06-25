type Listener = (ev: globalThis.Event) => void;
type StringMap = Record<string, string>;

export function $<T extends HTMLElement>(query: string, scope?: HTMLElement) {
  return (scope || document).querySelector<T>(query)!;
}

export function $$<T extends HTMLElement>(query: string, scope?: HTMLElement) {
  return (scope || document).querySelectorAll<T>(query)!;
}

export function $on(eventName: string, listener: Listener, el: HTMLElement) {
  el.addEventListener(eventName, listener);
}

export function $off(eventName: string, listener: Listener, el: HTMLElement) {
  el.removeEventListener(eventName, listener);
}

export function changeDisplay(id: string, visible = true): void {
  $(`#${id}`).style.display = visible ? "block" : "none";
}

export const show = (elId: string) => changeDisplay(elId, true);
export const hide = (elId: string) => changeDisplay(elId, false);

export const fadeIn = (query: string) => {
  const $el = $(query);
  $el.classList.remove("fade-out");
  $el.classList.add("fade-in");
};

export const fadeOut = (query: string) => {
  const $el = $(query);
  $el.classList.remove("fade-in");
  $el.classList.add("fade-out");
};

function translateCss(css: StringMap) {
  let style = "";
  for (const key in css) {
    style += `${key}:${css[key]};`;
  }
  return style;
}

interface $El {
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

export function raf(cb: (delta: number) => void): () => void {
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
