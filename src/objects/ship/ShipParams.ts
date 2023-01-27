import { GameObjectParams } from "@/objects/shared";
import { ShipFire } from "./ShipFireParams";
import { ShipMovement } from "./ShipMovementParams";

export interface ShipParams extends GameObjectParams {
  img: HTMLImageElement;
  fire?: ShipFire;
  movement?: ShipMovement;
}
