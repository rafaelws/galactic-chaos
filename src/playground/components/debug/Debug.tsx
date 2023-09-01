import { createSignal, For } from "solid-js";

import { events } from "../../events";
import { Checkbox } from "..";

const fieldNames = ["hitboxes", "trajectory", "statusText"] as const;
type FieldName = (typeof fieldNames)[number];
type FieldProps = { label: string; value: boolean };
type Fields = Record<FieldName, FieldProps>;

export interface DebugParams {
  hitboxes: boolean;
  trajectory: boolean;
  statusText: boolean;
}

const toDebugParams = (fields: Fields): DebugParams => ({
  hitboxes: fields.hitboxes.value,
  trajectory: fields.trajectory.value,
  statusText: fields.statusText.value,
});

export function Debug() {
  const [fields, setFields] = createSignal<Fields>({
    hitboxes: { label: "Show hitboxes", value: true },
    trajectory: { label: "Show trajectories", value: true },
    statusText: { label: "Show status text", value: true },
  });

  function handleChange(id: string, checked: boolean) {
    setFields((prev) => {
      prev[id as FieldName].value = checked;
      events.debug(toDebugParams(prev));
      return { ...prev };
    });
  }

  return (
    <For each={Object.entries(fields())}>
      {([name, props]) => (
        <Checkbox
          id={name}
          label={props.label}
          checked={props.value}
          onChange={(value) => handleChange(name, value)}
        />
      )}
    </For>
  );
}
