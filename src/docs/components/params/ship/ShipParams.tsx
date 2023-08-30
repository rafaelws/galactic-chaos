import { FireParams } from "@/core/objects/shared/fire/FireParams";
import { MovementParams } from "@/core/objects/shared/movement/MovementParams";
import { ShipParams } from "@/core/objects/ship/ShipParams";
import { events } from "@/docs/events";

import { Fire, Movement } from "../..";

export function ShipParameters() {
  let params: Partial<ShipParams> | null = null;

  function setParams(extras: Partial<ShipParams>) {
    params = { ...(params || {}), ...extras };
  }

  function handleFire(fire: FireParams) {
    setParams({ fire });
    if (params) events.ship(params);
  }

  function handleMovement(movement: MovementParams) {
    setParams({ movement });
    if (params) events.ship(params);
  }

  return (
    <>
      <Fire onUpdate={handleFire} />
      <Movement onUpdate={handleMovement} />
    </>
  );
}
