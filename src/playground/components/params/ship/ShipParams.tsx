import { FireParams } from "@/core/objects/shared/fire/FireParams";
import { MovementParams } from "@/core/objects/shared/movement/MovementParams";
import { ShipParams } from "@/core/objects/ship/ShipParams";
import { events } from "@/playground/events";

import { Fire, Movement } from "../..";

export function ShipParameters() {
  let params: Partial<ShipParams> = {};

  function setParams(extras: Partial<ShipParams>) {
    params = { ...params, ...extras };
  }

  function handleFire(fire: FireParams) {
    setParams({ fire });
    events.ship(params);
  }

  function handleMovement(movement: MovementParams) {
    setParams({ movement });
    events.ship(params);
  }

  return (
    <>
      <Fire onUpdate={handleFire} />
      <Movement onUpdate={handleMovement} />
    </>
  );
}
