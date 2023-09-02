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
  const [value, setValue] = createSignal(params.value);
  createEffect(() => {
    // .handle is 20% wide
    setValue((params.value / params.max) * 80);
  });
  return (
    <div class="slider">
      <div class="handle" style={{ "margin-left": `${value()}%` }}></div>
    </div>
  );
}
