import "./index.css";

import { CanvasManager } from "@/core";
import { $, $$, display, el, on, raf, show } from "@/core/dom";
import { throttle } from "@/core/util";

import { Assets, getAssets } from "./util";

let assets: Assets = {};
const cm = new CanvasManager();

const showStats = throttle((delta: number) => {
  if (!delta) return;
  $("#fps").textContent = (1000 / delta).toFixed(2);
  $("#frameTime").textContent = delta.toFixed(3);
});

const buildAsset = (img: HTMLImageElement) => {
  return el("div", {
    className: ["wrap"],
    data: { path: img.src },
    children: [
      el("img", {
        className: ["asset"],
        attributes: { src: img.src },
      }),
      // el("span", {
      //   className: ["description"],
      //   children: [img.src],
      // }),
    ],
  }).outerHTML;
  // return `
  //   <div class="wrap" data-path="${assetPath}">
  //     <img class="asset" src=${assetPath}/>
  //     <span class="description">${assetPath}</span>
  //   </div>
  // `;
};

function buildAssetPicker($el: HTMLElement, entityType: string) {
  $el.dataset.entity = entityType;
  $(".container", $el).innerHTML = assets[entityType].map(buildAsset).join("");
}

function render(delta: number) {
  cm.clear();
  showStats(delta);
  // const state: GameState = {
  //   delta,
  //   debug: {
  //     global: false,
  //     hitboxes: true,
  //     statusText: true,
  //     trajectory: true,
  //     entities: [...debugProfiles.AllEnemies],
  //   },
  //   player: { x: 0, y: 0, radius: 0 },
  //   worldBoundaries: cm.boundaries,
  // };

  // new Rock({
  //   img: assets.rocks[0],
  //   movement: linear(p(0, 1), p(1, 1)),
  // });
}

function setupEntitySelect() {
  const $el = $<HTMLSelectElement>("#entityType");
  on("change", onEntityChange, $el);
  onEntityChange.call($el);
}

function setupAssets() {
  const $assets = $$(".asset-picker .wrap");
  const fn = pickAsset($assets);
  $assets.forEach(($el) => on("click", fn, $el));
  fn.call($assets[0]);
}

function pickAsset($assets: NodeListOf<HTMLElement>) {
  return function (this: HTMLElement) {
    // const path = this.dataset.path || "";
    $assets.forEach(($el) => $el.classList.remove("active"));
    this.classList.add("active");
  };
}

function onEntityChange(this: HTMLSelectElement) {
  const $assetPicker = $("#picker");
  const entityType = $assetPicker.dataset.entity || "";

  if (this.value === entityType) return;

  buildAssetPicker($assetPicker, this.value);
  $$(".ctrl.params").forEach(($el) =>
    display($el, $el.classList.contains(this.value))
  );
  setupAssets();
}

async function setup() {
  assets = await getAssets();
  setupEntitySelect();
  raf(render);
  show(document.body);
}

document.addEventListener("DOMContentLoaded", setup);
