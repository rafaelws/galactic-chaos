import { RockParams } from "@/core/objects/rock/RockParams";
import { MovementParams } from "@/core/objects/shared/movement/MovementParams";
import { events } from "@/docs/events";

import { Movement, Slider } from "../..";

export function RockParameters() {
  let params: Partial<RockParams> | null = null;

  function setParams(extras: Partial<RockParams>) {
    params = { ...(params || {}), ...extras };
  }

  function handleMovement(movement: MovementParams) {
    setParams({ movement });
    if (params) events.rock(params);
  }

  function handleRotation(rotationSpeed: number) {
    setParams({ rotationSpeed });
    if (params) events.rock(params);
  }

  return (
    <>
      <Slider
        value={0}
        min={-360}
        max={360}
        label="Rotation (deg)"
        onChange={handleRotation}
      />
      <Movement onUpdate={handleMovement} />
    </>
  );
}
