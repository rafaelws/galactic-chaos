import { MovementParams } from "@/core/objects/shared/movement/MovementParams";

import { Movement, Slider } from "../..";

export function RockParameters() {
  function handleMovement(_: MovementParams) {
    // TODO
  }

  function handleRotation(_: number) {
    // TODO
  }

  return (
    <>
      <Slider
        value={0}
        min={-360}
        max={360}
        label="Rotation (deg)"
        onValue={handleRotation}
      />
      <Movement onUpdate={handleMovement} />
    </>
  );
}
