import {
  FireParams,
  FluentMovement,
  GameObjectParams,
  ImpactParams,
  MovementParams,
} from "../shared";

export interface ShipParams extends GameObjectParams {
  img: HTMLImageElement;

  movement: MovementParams | FluentMovement;
  impact?: ImpactParams;
  fire?: FireParams;
}
