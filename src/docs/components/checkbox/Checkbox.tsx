import "./styles.css";

import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useState } from "react";

import { ReactComponent as Icon } from "./check.svg";

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
    <label htmlFor={props.id}>
      {props.label}
      <RadixCheckbox.Root
        id={props.id}
        className="checkbox colors"
        checked={checked}
        onCheckedChange={handleChange}
      >
        <RadixCheckbox.Indicator>
          <Icon />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
    </label>
  );
}
