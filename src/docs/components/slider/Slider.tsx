import "./styles.css";

import * as RadixSlider from "@radix-ui/react-slider";
import { ChangeEvent, useState } from "react";

interface Props {
  label: string;
  onValue: (value: number) => void;
  value: number;
  min: number;
  max: number;
  step: number;
}

export function Slider(props: Props) {
  const [local, setLocal] = useState(props.value);

  function handleInputChange(ev: ChangeEvent<HTMLInputElement>) {
    ev.preventDefault();

    let value = Number(ev.target.value);
    if (isNaN(value)) return;

    if (value >= props.max) value = props.max;
    else if (value <= props.min) value = props.min;

    setLocal(value);
  }

  function handleSliderChange(values: number[]) {
    setLocal(values[0]);
  }

  function handleSliderCommit(values: number[]) {
    props.onValue(values[0]);
  }

  function reset() {
    const data = [props.value];
    handleSliderChange(data);
    handleSliderCommit(data);
  }

  return (
    <>
      <label className="slider-label">
        {props.label}
        <input
          className="common colors"
          value={local}
          onChange={handleInputChange}
        />
      </label>
      <RadixSlider.Root
        className="slider"
        value={[local]}
        onValueChange={handleSliderChange}
        onValueCommit={handleSliderCommit}
        min={props.min}
        max={props.max}
        step={props.step}
      >
        <RadixSlider.Track className="track">
          <RadixSlider.Range className="range" />
        </RadixSlider.Track>
        <RadixSlider.Thumb
          className="thumb"
          aria-label={props.label}
          onDoubleClick={reset}
        />
      </RadixSlider.Root>
    </>
  );
}
