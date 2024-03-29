import { StringMap } from ".";

type StOrEl = HTMLElement | string;

export function $<T extends Element>(query: string, scope?: Element) {
  return (scope || document).querySelector<T>(query)!;
}

export function $$<T extends Element>(query: string, scope?: Element) {
  return (scope || document).querySelectorAll<T>(query)!;
}

export const display = (target: StOrEl, visible = true) => {
  const $el = typeof target === "string" ? $<HTMLElement>(target) : target;
  $el.style.display = visible ? "block" : "none";
};

export const show = (target: StOrEl) => display(target);
export const hide = (target: StOrEl) => display(target, false);

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

interface El {
  className?: string[];
  children?: HTMLElement[] | string[];
  css?: StringMap;
  data?: StringMap;
  attributes?: StringMap;
  // TODO listeners
}

export function el(tag: string, $el?: El) {
  const nel = document.createElement(tag);

  if (!$el) return nel;

  const { className, children, css, data, attributes } = $el;
  if (className) nel.classList.add(...className);
  if (children) nel.append(...children);
  if (css) nel.style.cssText = translateCss(css);
  if (data) {
    for (const key in data) {
      nel.dataset[key] = data[key];
      // nel.setAttribute(`data-${key}`, data[key]);
    }
  }
  if (attributes) {
    for (const attr in attributes) {
      nel.setAttribute(attr, attributes[attr]);
    }
  }
  return nel;
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

export function cssVar(name: string, value?: string, el?: StOrEl) {
  const target =
    (typeof el === "string" ? document.querySelector<HTMLElement>(el) : el) ||
    document.documentElement;

  if (value) target.style.setProperty(name, value);
  return getComputedStyle(target).getPropertyValue(name);
}
