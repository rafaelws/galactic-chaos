import { throttle } from "@/common/util";
import { TriggerOnInput } from "./readInput";
import { $, hide, show } from "./util";

export namespace Options {
  const elId = "options";
  const el = `#${elId}`;

  let isOptionsOpen = false;

  let fieldIx = 0;

  function makeAllInactive() {
    const all = fields();
    for (let i = 0; i < all.length; i++) {
      all[i].classList.remove("active");
    }
    return all.length;
  }

  function fields() {
    return document.querySelectorAll(`${el} .field`);
  }

  function makeActive() {
    $(`${el} .field[data-ix="${fieldIx}"]`)?.classList.add("active");
  }

  function up() {
    if (!isOptionsOpen) return;
    const length = makeAllInactive();
    if (--fieldIx < 0) fieldIx = length - 1;
    makeActive();
  }

  function down() {
    if (!isOptionsOpen) return;
    const length = makeAllInactive();
    if (++fieldIx + 1 > length) fieldIx = 0;
    makeActive();
  }

  function left() {
    if (!isOptionsOpen) return;
  }

  function right() {
    if (!isOptionsOpen) return;
  }

  const ttime = 150;

  export const actions: TriggerOnInput[] = [
    { action: "D_UP", destroy: false, fn: throttle(up, ttime) },
    { action: "L_UP", destroy: false, fn: throttle(up, ttime) },
    { action: "L_DOWN", destroy: false, fn: throttle(down, ttime) },
    { action: "D_DOWN", destroy: false, fn: throttle(down, ttime) },

    { action: "D_LEFT", destroy: false, fn: throttle(left, ttime) },
    { action: "L_LEFT", destroy: false, fn: throttle(left, ttime) },
    { action: "D_RIGHT", destroy: false, fn: throttle(right, ttime) },
    { action: "L_RIGHT", destroy: false, fn: throttle(right, ttime) },
  ];

  export function toggle() {
    isOptionsOpen ? close() : open();
    isOptionsOpen = !isOptionsOpen;
  }

  function open() {
    show(elId);
    $(el)?.classList.add("active");

    fieldIx = 0;
    makeActive();
  }

  function close() {
    const $el = $(el);
    $el?.classList.remove("active");
    $el?.addEventListener("animationend", function onEnd() {
      hide(elId);
      $el?.removeEventListener("animationend", onEnd);
    });
  }
}
