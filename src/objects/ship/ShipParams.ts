import {
  FireParams,
  GameObjectParams,
  ImpactParams,
  MovementParams,
} from "../shared";

export interface ShipParams extends GameObjectParams {
  img: HTMLImageElement;

  movement?: MovementParams;
  impact?: ImpactParams;
  fire?: FireParams;
}
