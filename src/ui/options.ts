import { Config, ConfigKey, ConfigMap } from "@/common";
import { throttle } from "@/common/util";
import { TriggerOnInput } from "./readInput";
import { $, fadeIn, fadeOut } from "./util";

export function Options() {
  const elQuery = "#options";

  let isOptionsOpen = false;
  let currentFieldIx = 0;

  type Operation = "-" | "+" | null;

  function fields<T extends Element>() {
    return document.querySelectorAll<T>(`${elQuery} .field`);
  }

  function makeAllInactive() {
    const all = fields();
    all.forEach((el) => el.classList.remove("active"));
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
      Config.set(el.dataset.key as ConfigKey, value);
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
      Config.set(el.dataset.key as ConfigKey, value);
      el.dataset.value = "" + value;
    }

    // .handle is 20% wide
    const normalized = (value / max) * 80;
    el.querySelector<HTMLElement>(".handle")!.style.marginLeft =
      normalized + "%";
  }

  function init(config: ConfigMap) {
    fields<HTMLElement>().forEach((el) => {
      el.dataset.value = config[el.dataset.key as ConfigKey];
      action(null, el);
    });
  }

  function open() {
    if (isOptionsOpen === true) return;

    isOptionsOpen = true;
    init(Config.all());
    currentFieldIx = 0;
    makeCurrentActive();
    fadeIn(elQuery);
  }

  function close() {
    if (isOptionsOpen === false) return;

    isOptionsOpen = false;
    makeAllInactive();
    fadeOut(elQuery);
  }

  function toggle() {
    isOptionsOpen ? close() : open();
  }

  const actions: TriggerOnInput[] = [
    { action: "D_UP", destroyOnHit: false, fn: throttle(up, 150) },
    { action: "L_UP", destroyOnHit: false, fn: throttle(up, 150) },
    { action: "L_DOWN", destroyOnHit: false, fn: throttle(down, 150) },
    { action: "D_DOWN", destroyOnHit: false, fn: throttle(down, 150) },

    { action: "D_LEFT", destroyOnHit: false, fn: throttle(left, 20) },
    { action: "L_LEFT", destroyOnHit: false, fn: throttle(left, 20) },
    { action: "D_RIGHT", destroyOnHit: false, fn: throttle(right, 20) },
    { action: "L_RIGHT", destroyOnHit: false, fn: throttle(right, 20) },
  ];

  return {
    open,
    close,
    toggle,
    actions,
  };
}
