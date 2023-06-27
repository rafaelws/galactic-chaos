import { ChangeEvent, useEffect, useState } from "react";

import { CanvasManager } from "@/core";
import { raf, show } from "@/core/dom";
import { GameState, p } from "@/core/meta";
import { Rock } from "@/core/objects";
import { GameObject, linear } from "@/core/objects/shared";
import { throttle } from "@/core/util";

import {
  AssetPicker,
  BossParameters,
  RockParameters,
  ShipParameters,
} from "./components";
import { styles } from "./styles";
import { Assets, AssetType, assetTypes, getAssets } from "./util";

// TODO phantom player x, y
// TODO debug settings

type Stats = { fps: string; frameTime: string };

export function Main() {
  const cm = new CanvasManager("#playground");
  let entity: GameObject | null = null;

  const [img, setImg] = useState<HTMLImageElement>();
  const [current, setCurrent] = useState<AssetType>();
  const [assets, setAssets] = useState<Assets>();
  const [stats, setStats] = useState<Stats>({
    fps: "0",
    frameTime: "0",
  });

  useEffect(() => {
    show(document.body);
    getAssets().then((results) => {
      setAssets(results);
      setCurrent(assetTypes[0]);
    });
  }, []);

  useEffect(() => raf(loop), []);

  function loop(delta: number) {
    showStats(delta);
    render(delta);
  }

  const showStats = throttle((delta: number) => {
    setStats({
      fps: (1000 / delta).toFixed(2),
      frameTime: delta.toFixed(3),
    });
  });

  function render(delta: number) {
    cm.clear();
    if (!img) return;

    const state: GameState = {
      delta,
      debug: {
        global: false,
        hitboxes: true,
        statusText: true,
        trajectory: true,
        entities: true,
      },
      player: { x: 0, y: 0, radius: 0 },
      // FIXME can't trust these boundaries
      worldBoundaries: cm.boundaries,
    };

    if (!entity) {
      entity = new Rock({
        img,
        movement: linear(p(0, 0), p(1, 1)),
      });
    }
    entity.update(state);
    entity.draw(cm.context);
    console.log({ state, entity, cm });
  }

  function handleEntityChange(ev: ChangeEvent<HTMLSelectElement>) {
    entity = null;
    setImg(undefined);
    setCurrent(ev.target.value as AssetType);
  }

  let currentControl;
  if (current === "Boss") {
    currentControl = <BossParameters />;
  } else if (current === "Ship") {
    currentControl = <ShipParameters />;
  } else {
    currentControl = <RockParameters />;
  }

  return (
    <>
      <styles.Controls>
        <styles.Title>Main</styles.Title>
        <styles.Blade>
          {stats.fps} fps | {stats.frameTime} ms
        </styles.Blade>
        <styles.Title>Asset</styles.Title>
        <styles.Blade>
          <select value={current} onChange={handleEntityChange}>
            {assetTypes.map((type) => {
              return (
                <option key={type} value={type}>
                  {type}
                </option>
              );
            })}
          </select>
          {current && assets && (
            <AssetPicker
              assets={assets[current]}
              onPick={(img) => setImg(img)}
            />
          )}
        </styles.Blade>
        <styles.Title>Parameters</styles.Title>
        <styles.Blade>{currentControl}</styles.Blade>
      </styles.Controls>
    </>
  );
}
