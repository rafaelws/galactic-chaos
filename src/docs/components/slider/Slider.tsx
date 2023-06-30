import { useState } from "react";

import { Container, Input, Range, Root, Thumb, Track } from "./styles";

interface Props {
  label: string;
  onValue: (value: number) => void;
  value: number;
  min?: number;
  max?: number;
  step?: number;
}

export function Slider({ label, onValue, value, min, max, step }: Props) {
  const [local, setLocal] = useState(value);

  function handleChange(values: number[]) {
    setLocal(values[0]);
  }

  function handleCommit(values: number[]) {
    onValue(values[0]);
  }

  return (
    <>
      <Container>
        {label}
        <Input value={local} disabled />
      </Container>
      <Root
        onValueCommit={handleCommit}
        onValueChange={handleChange}
        defaultValue={[value]}
        min={min}
        max={max}
        step={step}
      >
        <Track>
          <Range />
        </Track>
        <Thumb aria-label={label} />
      </Root>
    </>
  );
}
