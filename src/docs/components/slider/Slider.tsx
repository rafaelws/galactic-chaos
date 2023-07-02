import { ChangeEvent, useState } from "react";

import { Container, Input, Range, Root, Thumb, Track } from "./styles";

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
    setLocal(Number(ev.target.value));
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
      <Container>
        {props.label}
        <Input value={local} onChange={handleInputChange} />
      </Container>
      <Root
        value={[local]}
        onValueChange={handleSliderChange}
        onValueCommit={handleSliderCommit}
        min={props.min}
        max={props.max}
        step={props.step}
      >
        <Track>
          <Range />
        </Track>
        <Thumb aria-label={props.label} onDoubleClick={reset} />
      </Root>
    </>
  );
}
