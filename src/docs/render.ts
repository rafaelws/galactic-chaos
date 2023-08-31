import { CanvasManager } from "@/core";
import { events } from "@/core/events";
import { GameState } from "@/core/meta";
import { Rock, RockParams, Ship, ShipParams } from "@/core/objects";
import { GameObject } from "@/core/objects/shared";

import { showStats } from "./components/debug";
import { events as parametricEvents } from "./events";
import { EntityType } from "./util";

let debug = {
  global: false,
  hitboxes: true,
  statusText: true,
  trajectory: true,
  entities: true,
};

export function prepare() {
  const cm = new CanvasManager("#playground");
  let change = false;

  let entityType: EntityType | null = null;
  let params: Partial<RockParams | ShipParams> = {};

  let entity: Rock | Ship | null = null;
  let spawnables: GameObject[] = [];

  const bindings = [
    events.game.onSpawn((object) => spawnables.push(object)),
    parametricEvents.onDebug((params) => {
      debug = { ...debug, ...params };
    }),
    parametricEvents.onImg((img) => {
      params.img = img;
      change = true;
    }),
    parametricEvents.onEntity((newType) => {
      if (entityType === newType) return;
      entityType = newType;
      params = {};
      change = true;
    }),
    parametricEvents.onRock((rockParams) => {
      params = rockParams;
      change = true;
    }),
    parametricEvents.onShip((shipParams) => {
      // params = { ...params, ...shipParams };
      params = shipParams;
      change = true;
    }),
  ];

  function destroy() {
    bindings.forEach((unsub) => unsub());
  }

  function render(delta: number) {
    showStats(delta);

    cm.clear();

    const state: GameState = {
      debug,
      delta,
      worldBoundaries: cm.boundaries,
      player: {
        x: cm.boundaries.width * 0.5,
        y: cm.boundaries.height * 0.9,
        radius: 0,
      },
    };

    if (change) {
      change = false;
      if (!params.img || !params.movement) return;
      const common = {
        img: params.img,
        movement: params.movement,
        ...params,
      };
      entity = entityType === "Rock" ? new Rock(common) : new Ship(common);
    }

    if (!entity) return;

    entity.update(state);

    if (entityType === "Ship") drawGhost(state, cm.context, params.img!);
    if (spawnables.length > 0) {
      const newSpawnables: GameObject[] = [];
      for (let i = 0; i < spawnables.length; i++) {
        const s = spawnables[i];
        s.update(state);
        s.draw(cm.context);
        if (s.isActive) newSpawnables.push(s);
      }
      spawnables = newSpawnables;
    }
    entity.draw(cm.context);

    if (!entity.isActive) {
      spawnables = [];
      entity = null;
    }
  }
  return { render, destroy };
}

function drawGhost(
  state: GameState,
  c: CanvasRenderingContext2D,
  img: HTMLImageElement
) {
  const cx = img.width * 0.5;
  const cy = img.height * 0.5;
  c.save();
  c.globalAlpha = 0.5; // TODO verify perf impacts
  c.translate(state.player.x, state.player.y);
  c.rotate(Math.PI);
  c.drawImage(img, -cx, -cy, img.width, img.height);
  c.restore();
}
