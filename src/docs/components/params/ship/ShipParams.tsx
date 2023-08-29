import { FireParams } from "@/core/objects/shared/fire/FireParams";
import { MovementParams } from "@/core/objects/shared/movement/MovementParams";

import { Fire, Movement } from "../..";

export function ShipParameters() {
  function handleFire(_: FireParams) {
    // TODO
  }

  function handleMovement(_: MovementParams) {
    // TODO
  }

  return (
    <>
      <Fire onUpdate={handleFire} />
      <Movement onUpdate={handleMovement} />
    </>
  );
}
