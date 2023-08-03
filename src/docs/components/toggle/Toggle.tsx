import "./styles.css";

import { createSignal } from "solid-js";

interface ToggleProps {
  value?: string;
  onChange(value: string): void;
  items: string[] | readonly string[];
}

export function Toggle(props: ToggleProps) {
  const [current, setCurrent] = createSignal(props.value);

  function handleClick(item: string) {
    if (current() === item) return;
    setCurrent(item);
    props.onChange(item);
  }

  return (
    <div role="group" class="toggle">
      {props.items.map((item) => (
        <button
          role="radio"
          aria-checked={item === current()}
          data-state={item === current() ? "on" : "off"}
          class="common colors item"
          onClick={() => handleClick(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
