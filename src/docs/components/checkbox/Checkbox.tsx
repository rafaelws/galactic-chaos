import { CheckedState } from "@radix-ui/react-checkbox";
import { useState } from "react";

import { Label } from "@/docs/styles";

import { CheckboxIndicator, CheckboxRoot, CheckIcon } from "./styles";

interface Props {
  id: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function Checkbox(props: Props) {
  const [checked, setChecked] = useState(props.value);

  function handleChange(state: CheckedState) {
    const value = state === "indeterminate" ? false : state;
    setChecked(value);
    props.onChange(value);
  }

  return (
    <Label htmlFor={props.id}>
      {props.label}
      <CheckboxRoot
        id={props.id}
        checked={checked}
        onCheckedChange={handleChange}
      >
        <CheckboxIndicator>
          <CheckIcon />
        </CheckboxIndicator>
      </CheckboxRoot>
    </Label>
  );
}
