import "./styles.css";

import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";

import { clamp, lerp } from "@/core/math";
import { Point } from "@/core/meta";

type Orientation = "vertical" | "horizontal";

interface Props {
  label?: string;
  onValue: (value: number) => void;
  value: number;
  min: number;
  max: number;
  orientation?: Orientation;
  disabled?: boolean;
}

// TODO missing feature: step
// FIXME value is always floored
// FIXME after `dragEnd`, `handleSliderClick` is fired
export function Slider(props: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const mouseOffsetRef = useRef<number>(0);
  const rangeRef = useRef<number>(props.max - props.min);

  const orientation = props.orientation || "horizontal";
  const isHorizontal = orientation === "horizontal";
  const cssProperty = isHorizontal ? "left" : "top";

  const [value, setValue] = useState<number>();
  const [position, setPosition] = useState<number>();

  useEffect(() => {
    setValue(props.value);
    updatePosition(props.value);
  }, [props.value]);

  function drag(ev: globalThis.MouseEvent) {
    moveTo({ x: ev.clientX, y: ev.clientY });
  }

  function dragEnd() {
    window.removeEventListener("mousemove", drag);
    window.removeEventListener("mouseup", dragEnd);
  }

  function dragStart(ev: MouseEvent<HTMLSpanElement>) {
    calculateThumbOffset({ x: ev.clientX, y: ev.clientY });
    window.addEventListener("mousemove", drag);
    window.addEventListener("mouseup", dragEnd);
  }

  function calculateThumbOffset(
    { x, y }: Point,
    thumbRect = thumbRef.current?.getBoundingClientRect()
  ) {
    if (!thumbRect) return;
    mouseOffsetRef.current = isHorizontal
      ? x - thumbRect.left
      : y - thumbRect.top;
  }

  function getMax(
    sliderRect = sliderRef.current?.getBoundingClientRect(),
    thumb = thumbRef.current
  ) {
    if (!sliderRect || !thumb) return 0;
    const thumbSize = isHorizontal ? thumb.clientWidth : thumb.clientHeight;
    return (isHorizontal ? sliderRect.width : sliderRect.height) - thumbSize;
  }

  function moveTo(
    { x, y }: Point,
    sliderRect = sliderRef.current?.getBoundingClientRect(),
    offset = mouseOffsetRef.current
  ) {
    if (props.disabled || !sliderRect) return;
    const { left, top } = sliderRect;
    let pos = (isHorizontal ? x - left : y - top) - offset;

    const max = getMax(sliderRect);
    pos = clamp(pos, 0, max);
    updateValue(pos / max);
    setPosition(pos);
  }

  function updateValue(normalizedPosition: number) {
    const val = Math.floor(lerp(props.min, props.max, normalizedPosition));
    setValue(val);
    props.onValue(val);
  }

  function updatePosition(val: number, range = rangeRef.current) {
    if (range === 0) return;
    const normalized = Math.max(Math.min(val, props.max), props.min);
    const pos = ((normalized - props.min) / range) * getMax();
    setPosition(pos);
  }

  function handleInput(ev: ChangeEvent<HTMLInputElement>) {
    let val = Number(ev.target.value);
    if (isNaN(val)) {
      val = value || props.value;
      // https://github.com/preactjs/preact/issues/1899
      ev.target.value = val.toString();
      return setValue(val);
    }
    if (val === value) return;
    val = clamp(val, props.min, props.max);

    ev.target.value = val.toString();
    updatePosition(val);
    setValue(val);
  }

  function reset() {
    setValue(props.value);
    updatePosition(props.value);
  }

  return (
    <>
      {props.label && (
        <label className="slider-label">
          {props.label}
          <input
            className="common colors"
            value={value}
            onChange={handleInput}
          />
        </label>
      )}
      <div
        ref={sliderRef}
        className={`slider ${orientation} ${props.disabled ? "disabled" : ""}`}
        onClick={(ev) => moveTo({ x: ev.clientX, y: ev.clientY })}
      >
        <div className="track">
          <span
            className="thumb"
            ref={thumbRef}
            onMouseDown={dragStart}
            onDoubleClick={reset}
            style={{ [cssProperty]: position }}
          />
        </div>
      </div>
    </>
  );
}
