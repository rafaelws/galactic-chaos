import "./styles.css";

import { createSignal, For } from "solid-js";

interface RadioProps {
  value?: string;
  onChange(value: string): void;
  items: string[] | readonly string[];
}

export function Radio(props: RadioProps) {
  const [current, setCurrent] = createSignal(props.value);

  const isCurrent = (item: string) => item === current();

  function handleClick(item: string) {
    if (current() === item) return;
    setCurrent(item);
    props.onChange(item);
  }

  return (
    <div role="group" class="radio">
      <For each={props.items}>
        {(item) => (
          <button
            role="radio"
            aria-checked={isCurrent(item)}
            data-state={isCurrent(item) ? "on" : "off"}
            class="common colors item"
            classList={{ active: isCurrent(item) }}
            onClick={() => handleClick(item)}
          >
            {item}
          </button>
        )}
      </For>
    </div>
  );
}
