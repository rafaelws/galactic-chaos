import "./index.css";

import { $, $$, on, raf } from "@/core/dom";
import { throttle } from "@/core/util";

import { getAssets } from "./util";

const assets = getAssets();

const showStats = throttle((delta: number) => {
  if (!delta) return;
  $("#fps").textContent = (1000 / delta).toFixed(2);
  $("#frameTime").textContent = delta.toFixed(3);
});

const buildAsset = (assetPath: string) => {
  // return el("div", {
  //   className: ["wrap"],
  //   data: { path: assetPath },
  //   children: [
  //     el("img", {
  //       className: ["asset"],
  //       attributes: { src: assetPath },
  //     }),
  //     el("span", {
  //       className: ["description"],
  //       children: [assetPath],
  //     }),
  //   ],
  // }).outerHTML;
  return `
    <div class="wrap" data-path="${assetPath}">
      <img class="asset" src=${assetPath}/>
      <span class="description">${assetPath}</span>
    </div>
  `;
};

function buildAssetPicker($el: HTMLElement, entityType: string) {
  $el.dataset.entity = entityType;
  $(".container", $el).innerHTML = assets[entityType].map(buildAsset).join("");
}

function render(delta: number) {
  showStats(delta);
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
    const { path } = this.dataset || "";
    if (!path) return;
    // TODO do something with path
    $assets.forEach(($el) => $el.classList.remove("active"));
    this.classList.add("active");
  };
}

function onEntityChange(this: HTMLSelectElement) {
  const $assetPicker = $("#picker");
  const entityType = $assetPicker.dataset.entity || "";

  if (this.value === entityType) return;

  buildAssetPicker($assetPicker, this.value);
  $$(".ctrl.params").forEach(($el) => {
    $el.style.display = $el.classList.contains(this.value) ? "block" : "none";
  });
  setupAssets();
}

function setup() {
  setupEntitySelect();
  raf(render);
  document.body.style.display = "block";
}

document.addEventListener("DOMContentLoaded", setup);
