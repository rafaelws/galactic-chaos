import "./styles.css";

import {
  createResource,
  createSignal,
  Match,
  onMount,
  Show,
  Switch,
} from "solid-js";

import { raf, show } from "@/core/dom";

import {
  AssetPicker,
  Debug,
  RockParameters,
  ShipParameters,
  Stats,
  Toggle,
} from "./components";
import { setupRender } from "./render";
import { EntityType, entityTypes, loadAssets } from "./util";

// TODO phantom player x, y
const { render } = setupRender();

export function Main() {
  // useEffect(() => {
  //   update({ img, assetType: current });
  // }, [img, current]);

  onMount(() => {
    raf(render);
    show(document.body);
  });

  const [assets] = createResource(loadAssets);
  const [, setImg] = createSignal<HTMLImageElement>();
  const [current, setCurrent] = createSignal<EntityType>(entityTypes[0]);

  const currentAssets = () => assets()![current()];

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
          <Toggle
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
