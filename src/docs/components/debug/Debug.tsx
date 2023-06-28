import { ChangeEvent, useState } from "react";

import { UpdateFn } from "../../render";

const fieldNames = ["hitboxes", "trajectory", "statusText"] as const;
type FieldName = (typeof fieldNames)[number];
type FieldProps = { label: string; value: boolean };
type Fields = Record<FieldName, FieldProps>;

interface Props {
  update: UpdateFn;
}

export function Debug({ update }: Props) {
  const [fields, setFields] = useState<Fields>({
    hitboxes: { label: "Show hitboxes", value: true },
    trajectory: { label: "Show trajectories", value: true },
    statusText: { label: "Show status text", value: true },
  });

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    const { id, checked } = ev.target;
    update({ debug: { [id]: checked } });
    setFields((old) => {
      old[id as FieldName].value = checked;
      return { ...old };
    });
  }

  return (
    <>
      {Object.entries(fields).map(([name, props]) => (
        <label key={name} htmlFor={name}>
          {props.label}
          <input
            id={name}
            type="checkbox"
            checked={props.value}
            onChange={handleChange}
          />
        </label>
      ))}
    </>
  );
}
