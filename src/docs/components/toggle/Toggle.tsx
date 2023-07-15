import "./styles.css";

import { useState } from "react";

interface ToggleProps {
  value?: string;
  onChange(value: string): void;
  items: string[] | readonly string[];
}

export function Toggle(props: ToggleProps) {
  const [current, setCurrent] = useState(props.value);

  function handleClick(item: string) {
    if (current === item) return;
    setCurrent(item);
    props.onChange(item);
  }

  return (
    <div role="group" className="toggle">
      {props.items.map((item) => (
        <button
          role="radio"
          aria-checked={item === current}
          data-state={item === current ? "on" : "off"}
          className="common colors item"
          onClick={() => handleClick(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
