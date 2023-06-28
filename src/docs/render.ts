import { CanvasManager } from "@/core";
import { GameObject } from "@/core/objects";

import { EntityType } from "./util";

let debug = {
  global: false,
  hitboxes: true,
  statusText: true,
  trajectory: true,
  entities: true,
};

const defaults = {
  debug,
  player: { x: 0, y: 0, radius: 0 },
};

interface UpdateEvent {
  img?: HTMLImageElement;
  assetType?: EntityType;
  debug?: Partial<typeof debug>;
}

export type UpdateFn = (ev: UpdateEvent) => void;
export type RenderFn = (delta: number) => void;
export type SetupRenderFn = { render: RenderFn; update: UpdateFn };

export function setupRender(): SetupRenderFn {
  const cm = new CanvasManager("#playground");
  const asset: GameObject | null = null;

  const params: UpdateEvent = {};

  function update(ev: UpdateEvent) {
    if (ev.debug) debug = { ...debug, ...ev.debug };
    // TODO
    if (ev.assetType !== params.assetType) {
      // TODO reinstantiate asset
    }
    if (asset && ev.img && ev.img !== params.img) {
      // TODO update image
    }
  }

  function render(delta: number) {
    // console.log(delta);
    const state = {
      ...defaults,
      delta,
      worldBoundaries: cm.boundaries,
    };
    cm.clear();
    // TODO render object
    // if (!entity) {
    //   entity = new Rock({
    //     img,
    //     movement: linear(p(0, 0), p(1, 1)),
    //   });
    // }
    // entity.update(state);
    // entity.draw(cm.context);
    // console.log({ state, entity, cm });
  }

  return { render, update };
}
