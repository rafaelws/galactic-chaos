import "./styles.css";

import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";

import { Point } from "@/core/meta";

type Orientation = "vertical" | "horizontal";

interface Props {
  label?: string;
  onValue: (value: number) => void;
  value: number;
  min: number;
  max: number;
  orientation?: Orientation;
}

// FIXME step
// FIXME getSliderSize (find a better approach)
// FIXME after `dragEnd`, `handleSliderClick` is fired
export function Slider({ onValue, ...props }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  const range = props.max - props.min;
  const orientation = props.orientation || "horizontal";
  const isHorizontal = orientation === "horizontal";
  const cssTrackProperty = isHorizontal ? "width" : "height";

  const getSliderSize = (slider = sliderRef.current) => {
    if (!slider) return 0;
    return slider[isHorizontal ? "clientWidth" : "clientHeight"];
  };

  const toPosition = (val: number, sliderSize = getSliderSize()) => {
    if (range === 0) return 0;
    const normalized = Math.max(Math.min(val, props.max), props.min);
    return ((normalized - props.min) / range) * sliderSize;
  };

  const toValue = (position: number, sliderSize = getSliderSize()) => {
    if (sliderSize === 0) return 0;
    const percent = position / sliderSize;
    return percent * range + props.min;
  };

  const [value, setValue] = useState<number>(props.value);
  const [position, setPosition] = useState<number>();

  useEffect(() => {
    setPosition(toPosition(props.value));
  }, []);

  useEffect(() => {
    if (value !== undefined) onValue(value);
  }, [value, onValue]);

  function drag(ev: globalThis.MouseEvent) {
    moveTo({ x: ev.clientX, y: ev.clientY });
  }

  function dragEnd() {
    window.removeEventListener("mousemove", drag);
    window.removeEventListener("mouseup", dragEnd);
  }

  function dragStart() {
    window.addEventListener("mousemove", drag);
    window.addEventListener("mouseup", dragEnd);
  }

  function moveTo(
    point: Point,
    slider = sliderRef.current,
    thumb = thumbRef.current
  ) {
    if (!slider || !thumb) return;
    const { width, height, top, left } = slider.getBoundingClientRect();

    // FIXME properly offset
    const offset = thumb.clientWidth * 0.5;

    const max = isHorizontal ? width : height;
    let pos = (isHorizontal ? point.x - left : point.y - top) - offset;

    if (pos > max) pos = max;
    else if (pos < 0) pos = 0;

    setPosition(pos);
    setValue(Math.floor(toValue(pos)));
  }

  function handleSliderClick(ev: MouseEvent<HTMLDivElement>) {
    moveTo({ x: ev.clientX, y: ev.clientY });
  }

  function handleInput(ev: ChangeEvent<HTMLInputElement>) {
    ev.preventDefault();
    let val = Number(ev.target.value);
    if (isNaN(val)) {
      val = value || props.value;
      // https://github.com/preactjs/preact/issues/1899
      ev.target.value = val.toString();
      return setValue(val);
    }
    if (val === value) return;
    if (val >= props.max) val = props.max;
    else if (val <= props.min) val = props.min;
    setValue(val);
    setPosition(toPosition(val));
    ev.target.value = val.toString();
  }

  function reset() {
    setValue(props.value);
    setPosition(toPosition(props.value));
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
        className={`slider ${orientation}`}
        onClick={handleSliderClick}
      >
        <div
          className="track"
          style={{
            [cssTrackProperty]: position,
          }}
        ></div>
        <span
          className="thumb"
          ref={thumbRef}
          onMouseDown={dragStart}
          onDoubleClick={reset}
        ></span>
      </div>
    </>
  );
}
