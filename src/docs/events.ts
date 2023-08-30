import { RockParams } from "@/core/objects/rock/RockParams";
import { ShipParams } from "@/core/objects/ship/ShipParams";
import { PubSub } from "@/core/PubSub";

import { DebugParams } from "./components";
import { EntityType } from "./util";

const ps = new PubSub();

export const events = {
  debug(params: DebugParams) {
    ps.pub("params:debug", params);
  },
  onDebug(sub: (params: DebugParams) => void) {
    return ps.sub("params:debug", sub);
  },
  img(img: HTMLImageElement) {
    ps.pub("params:img", img);
  },
  onImg(sub: (img: HTMLImageElement) => void) {
    return ps.sub("params:img", sub);
  },
  entity(entityType: EntityType) {
    ps.pub("params:entity", entityType);
  },
  onEntity(sub: (entityType: EntityType) => void) {
    return ps.sub("params:entity", sub);
  },
  ship(params: Partial<ShipParams>) {
    ps.pub("params:ship", params);
  },
  onShip(sub: (params: Partial<ShipParams>) => void) {
    return ps.sub("params:ship", sub);
  },
  rock(params: Partial<RockParams>) {
    ps.pub("params:rock", params);
  },
  onRock(sub: (params: Partial<RockParams>) => void) {
    return ps.sub("params:rock", sub);
  },
};
