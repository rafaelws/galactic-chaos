import { Coordinate, Destroyable } from "@/common";

export type ControlState = {
  [type in ControlAction]?: ControlStateData;
};

export type ControlStateData = {
  active: boolean;
  rate?: number;
  coordinate?: Coordinate;
};

export interface InputHandler extends Destroyable {
  getState(): ControlState;
}

type CustomActions = "ROTATE";

export type ControlAction =
  | CustomActions
  | "A"
  | "B"
  | "X"
  | "Y"
  | "LB"
  | "RB"
  | "LT"
  | "RT"
  | "SELECT"
  | "START"
  | "L_CLICK"
  | "R_CLICK"
  | "D_UP"
  | "D_DOWN"
  | "D_LEFT"
  | "D_RIGHT"
  | "JOKER"
  | "L_UP"
  | "L_DOWN"
  | "L_LEFT"
  | "L_RIGHT"
  | "R_UP"
  | "R_DOWN"
  | "R_LEFT"
  | "R_RIGHT";
