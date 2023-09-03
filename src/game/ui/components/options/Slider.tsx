import { createEffect, createSignal } from "solid-js";

import { clamp } from "@/core/math";

export interface SliderParams {
  value: number;
  min: number;
  max: number;
  step: number;
}

export function SliderCtrl({ min, max, step }: SliderParams) {
  return (value: number, operation: "+" | "-") => {
    return clamp(value + (operation === "+" ? step : -step), min, max);
  };
}

export function Slider(params: SliderParams) {
  // .handle is 20% wide
  const toValue = (val: number) => (val / params.max) * 80;
  const [value, setValue] = createSignal(toValue(params.value));

  createEffect(() => setValue(toValue(params.value)));

  return (
    <div class="slider">
      <div class="handle" style={{ "margin-left": `${value()}%` }}></div>
    </div>
  );
}
