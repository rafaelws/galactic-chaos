import "./styles.css";

import {
  createEffect,
  createResource,
  createSignal,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
} from "solid-js";

import { raf, show } from "@/core/dom";

import {
  AssetPicker,
  Debug,
  Radio,
  RockParameters,
  ShipParameters,
  Stats,
} from "./components";
import { events } from "./events";
import { prepare } from "./render";
import { EntityType, entityTypes, loadAssets } from "./util";

export function Main() {
  const [assets] = createResource(loadAssets);
  const [img, setImg] = createSignal<HTMLImageElement>();
  const [current, setCurrent] = createSignal<EntityType>(entityTypes[1]);

  const currentAssets = () => (assets() ? assets()![current()] : []);

  const { render, destroy } = prepare();

  onMount(() => {
    raf(render);
    show(document.body);
  });

  onCleanup(() => destroy());

  createEffect(() => {
    if (img()) events.img(img()!);
  });

  createEffect(() => {
    if (current()) events.entity(current()!);
  });

  createEffect(() => {
    if (currentAssets().length > 0) setImg(currentAssets()[0]);
  });

  function handleEntityChange(value: EntityType) {
    // TODO when empty, could close the AssetPicker
    if (!value || value.trim() === "") return;
    setImg(undefined);
    setCurrent(value);
  }

  return (
    <div class="main">
      <h3 class="title">
        <Stats title="Debug" />
      </h3>
      <div class="partition">
        <Debug />
      </div>
      <h3 class="title">Asset</h3>
      <div class="partition">
        <Show when={current()}>
          <Radio
            value={current()}
            items={entityTypes}
            onChange={handleEntityChange}
          />
          <Show when={!assets.loading}>
            <AssetPicker
              assets={currentAssets()}
              onPick={(img) => setImg(img)}
            />
          </Show>
        </Show>
      </div>
      <h3 class="title">Parameters</h3>
      <div class="partition">
        <Switch>
          <Match when={current() === "Ship"}>
            <ShipParameters />
          </Match>
          <Match when={current() === "Rock"}>
            <RockParameters />
          </Match>
        </Switch>
      </div>
    </div>
  );
}
