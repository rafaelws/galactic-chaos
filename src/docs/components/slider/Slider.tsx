import "./styles.css";

import { createEffect, createSignal, JSX, Show } from "solid-js";

import { cssVar } from "@/core/dom";
import { clamp, lerp } from "@/core/math";
import { Point } from "@/core/meta";

import { Input } from "..";

type Orientation = "vertical" | "horizontal";

interface Props {
  class?: string;
  label?: string;
  onValue?: (value: number) => void;
  value?: number;
  min: number;
  max: number;
  orientation?: Orientation;
  disabled?: boolean;
}

export function Slider(props: Props) {
  let slider: HTMLDivElement | undefined;
  let thumb: HTMLSpanElement | undefined;

  let mouseOffset = 0;
  const orientation = props.orientation || "horizontal";
  const isHorizontal = orientation === "horizontal";

  const range = props.max - props.min;
  const initialValue = props.value == undefined ? props.min : props.value;
  const classes = () =>
    [
      "slider",
      orientation,
      props.disabled ? "disabled" : "",
      props.class || "",
    ].join(" ");

  const [value, setValue] = createSignal<number>(initialValue);
  createEffect(() => {
    const val = props.value || initialValue;
    setValue(val);
    setPosition(valueToPosition(val));
  });

  function calculateThumbOffset(
    { x, y }: Point,
    thumbRect = thumb?.getBoundingClientRect()
  ) {
    if (!thumbRect) return;
    mouseOffset = isHorizontal ? x - thumbRect.left : y - thumbRect.top;
  }

  function getMax(sliderRect = slider?.getBoundingClientRect()) {
    if (!sliderRect || !thumb) return 0;
    const thumbSize = isHorizontal ? thumb.clientWidth : thumb.clientHeight;
    return (isHorizontal ? sliderRect.width : sliderRect.height) - thumbSize;
  }

  const positionToValue = (position: number, max = getMax()) =>
    Math.trunc(lerp(props.min, props.max, position / max));

  function valueToPosition(value: number, max = getMax()) {
    if (range === 0) return 0;
    const normalized = Math.max(Math.min(value, props.max), props.min);
    return ((normalized - props.min) / range) * max;
  }

  const setPosition = (position: number) => {
    cssVar("--position", `${position}px`, thumb);
  };

  function drag(ev: globalThis.MouseEvent) {
    moveTo({ x: ev.clientX, y: ev.clientY });
  }

  function dragEnd() {
    window.removeEventListener("mousemove", drag);
    window.removeEventListener("mouseup", dragEnd);
  }

  function dragStart(ev: globalThis.MouseEvent) {
    calculateThumbOffset({ x: ev.clientX, y: ev.clientY });
    window.addEventListener("mousemove", drag);
    window.addEventListener("mouseup", dragEnd);
  }

  function moveTo(
    { x, y }: Point,
    sliderRect = slider?.getBoundingClientRect(),
    offset = mouseOffset
  ) {
    if (props.disabled || !sliderRect) return;
    const { left, top } = sliderRect;
    let pos = (isHorizontal ? x - left : y - top) - offset;

    const max = getMax(sliderRect);
    pos = clamp(pos, 0, max);

    const val = positionToValue(pos, max);
    setValue(val);
    props.onValue && props.onValue(val);
    setPosition(pos);
  }

  const handleInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (ev) => {
    let val = Number(ev.currentTarget.value);
    if (isNaN(val)) {
      val = props.value || initialValue;
      ev.currentTarget.value = val.toString();
      return;
    }
    if (val === props.value) return;
    val = clamp(val, props.min, props.max);

    ev.currentTarget.value = val.toString();
    setValue(val);
    setPosition(valueToPosition(val));
  };

  function reset() {
    setPosition(valueToPosition(initialValue));
  }

  return (
    <div class={classes()}>
      <Show when={props.label != undefined}>
        <label>
          {props.label}
          <Input value={value()} onInput={handleInput} />
        </label>
      </Show>
      <div
        ref={slider!}
        class="container"
        onClick={(ev) => moveTo({ x: ev.clientX, y: ev.clientY })}
      >
        <div class="track">
          <span
            class="thumb"
            ref={thumb!}
            onMouseDown={dragStart}
            onDblClick={reset}
          />
        </div>
      </div>
    </div>
  );
}
