import "./styles.css";

import { createEffect, createSignal, Show } from "solid-js";

import {
  FireParams,
  FirePrecision,
} from "@/core/objects/shared/fire/FireParams";

import { Radio, Slider } from "..";

interface Params {
  onUpdate?: (params: FireParams) => void;
}

const precisionMap: Record<string, FirePrecision> = {
  Angle: FirePrecision.Simple,
  Loose: FirePrecision.Loose,
  Accurate: FirePrecision.Accurate,
};
const precisionProfiles = Object.keys(precisionMap);

export function Fire(params: Params) {
  const [angle, setAngle] = createSignal(180);
  const [rate, setRate] = createSignal(0);
  const [precision, setPrecision] = createSignal(precisionProfiles[0]);

  createEffect(() => {
    if (!params.onUpdate) return;
    params.onUpdate({
      angle: angle(),
      precision: precisionMap[precision()],
      rate: rate(),
    });
  });

  return (
    <div class="fire-container">
      <Radio
        value={precision()}
        items={precisionProfiles}
        onChange={(value) => setPrecision(value)}
      />
      <Show when={precision() === precisionProfiles[0]}>
        <Slider
          value={angle()}
          min={-360}
          max={360}
          label="Angle"
          onChange={(value) => setAngle(value)}
        />
      </Show>
      <Slider
        value={rate()}
        min={0}
        max={9999}
        label="Rate (ms)"
        onChange={(value) => setRate(value)}
      />
    </div>
  );
}
