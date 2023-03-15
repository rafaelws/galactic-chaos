import { Config } from "@/common";
import { throttle } from "@/common/util";
import { TriggerOnInput } from "./readInput";
import { $, fadeIn, fadeOut } from "./util";

export namespace Options {
  const elQuery = "#options";

  let isOptionsOpen = false;
  let currentFieldIx = 0;

  type Operation = "-" | "+" | null;

  function fields<T extends Element>() {
    return document.querySelectorAll<T>(`${elQuery} .field`);
  }

  function makeAllInactive() {
    const all = fields();
    for (let i = 0; i < all.length; i++) {
      all[i].classList.remove("active");
    }
    return all.length;
  }

  function current<T extends Element>() {
    return $<T>(`${elQuery} .field[data-ix="${currentFieldIx}"]`);
  }

  function makeCurrentActive() {
    current()?.classList.add("active");
  }

  function up() {
    if (!isOptionsOpen) return;
    const length = makeAllInactive();
    if (--currentFieldIx < 0) currentFieldIx = length - 1;
    makeCurrentActive();
  }

  function down() {
    if (!isOptionsOpen) return;
    const length = makeAllInactive();
    if (++currentFieldIx + 1 > length) currentFieldIx = 0;
    makeCurrentActive();
  }

  function left() {
    if (!isOptionsOpen) return;
    action("-", current<HTMLElement>());
  }

  function right() {
    if (!isOptionsOpen) return;
    action("+", current<HTMLElement>());
  }

  function action(operation: Operation, el: HTMLElement | null) {
    if (!el?.dataset) return;
    switch (el.dataset.type) {
      case "toggle":
        uiToggle(operation, el);
        break;
      case "slider":
        uiSlider(operation, el);
        break;
    }
  }

  function uiToggle(operation: Operation, el: HTMLElement) {
    let value = el.dataset.value === "true" ? true : false;

    if (operation !== null) {
      value = operation === "+" ? true : false;
      Config.set(el.dataset.key as Config.Key, value);
    }

    if (value) {
      el.querySelector<HTMLElement>(".toggle")?.classList.add("active");
    } else {
      el.querySelector<HTMLElement>(".toggle")?.classList.remove("active");
    }
  }

  function uiSlider(operation: Operation, el: HTMLElement) {
    let value = Number(el.dataset.value);
    const max = Number(el.dataset.max);

    if (operation !== null) {
      const step = Number(el.dataset.step);
      const min = Number(el.dataset.min);
      value += operation === "+" ? step : -step;

      if (value <= min) value = min;
      if (value >= max) value = max;
      Config.set(el.dataset.key as Config.Key, value);
      el.dataset.value = "" + value;
    }

    // .handle is 20% wide
    const normalized = (value / max) * 80;
    el.querySelector<HTMLElement>(".handle")!.style.marginLeft =
      normalized + "%";
  }

  function init(config: Config.Map) {
    fields<HTMLElement>().forEach((el) => {
      el.dataset.value = config[el.dataset.key as Config.Key];
      action(null, el);
    });
  }

  export function open() {
    isOptionsOpen = true;
    init(Config.all());
    currentFieldIx = 0;
    makeCurrentActive();
    fadeIn(elQuery);
  }

  export function close() {
    isOptionsOpen = false;
    makeAllInactive();
    fadeOut(elQuery);
  }

  export function toggle() {
    isOptionsOpen ? close() : open();
  }

  export const actions: TriggerOnInput[] = [
    { action: "D_UP", destroy: false, fn: throttle(up, 150) },
    { action: "L_UP", destroy: false, fn: throttle(up, 150) },
    { action: "L_DOWN", destroy: false, fn: throttle(down, 150) },
    { action: "D_DOWN", destroy: false, fn: throttle(down, 150) },

    { action: "D_LEFT", destroy: false, fn: throttle(left, 25) },
    { action: "L_LEFT", destroy: false, fn: throttle(left, 25) },
    { action: "D_RIGHT", destroy: false, fn: throttle(right, 25) },
    { action: "L_RIGHT", destroy: false, fn: throttle(right, 25) },
  ];
}
