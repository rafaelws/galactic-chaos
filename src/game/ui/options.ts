import { Config, ConfigKey, ConfigMap } from "@/core";
import { $, $$, fadeIn, fadeOut } from "@/core/dom";
import { throttle } from "@/core/util";

import { TriggerOnInput } from "./readInput";

export function Options() {
  const elQuery = "#options";

  let isOptionsOpen = false;
  let currentFieldIx = 0;

  type Operation = "-" | "+" | null;

  const fields = () => $$<HTMLElement>(`${elQuery} .field`);
  const current = () =>
    $<HTMLElement>(`${elQuery} .field[data-ix="${currentFieldIx}"]`);

  function makeAllInactive() {
    const all = fields();
    all.forEach((el) => el.classList.remove("active"));
    return all.length;
  }

  function makeCurrentActive() {
    current().classList.add("active");
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
    action("-", current());
  }

  function right() {
    if (!isOptionsOpen) return;
    action("+", current());
  }

  function action(operation: Operation, el: HTMLElement) {
    if (!el.dataset) return;
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

    if (value) $(".toggle").classList.add("active");
    else $(".toggle").classList.remove("active");
  }

  function uiSlider(operation: Operation, $el: HTMLElement) {
    let value = Number($el.dataset.value);
    const max = Number($el.dataset.max);

    if (operation !== null) {
      const step = Number($el.dataset.step);
      const min = Number($el.dataset.min);
      value += operation === "+" ? step : -step;

      if (value <= min) value = min;
      if (value >= max) value = max;
      Config.set($el.dataset.key as ConfigKey, value);
      $el.dataset.value = "" + value;
    }

    // .handle is 20% wide
    const normalized = (value / max) * 80;
    $<HTMLElement>(".handle", $el).style.marginLeft = normalized + "%";
  }

  function init(config: ConfigMap) {
    fields().forEach((el) => {
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
