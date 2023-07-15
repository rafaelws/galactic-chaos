import "./styles.css";

import { useEffect, useState } from "react";

import { raf, show } from "@/core/dom";

import {
  AssetPicker,
  Debug,
  RockParameters,
  ShipParameters,
  Stats,
  Toggle,
  ToggleItem,
} from "./components";
import { setupRender } from "./render";
import { Assets, EntityType, entityTypes, loadAssets } from "./util";

// TODO phantom player x, y

const { render, update } = setupRender();

export function Main() {
  const [img, setImg] = useState<HTMLImageElement>();
  const [current, setCurrent] = useState<EntityType>();
  const [assets, setAssets] = useState<Assets>();

  useEffect(() => {
    update({ img, assetType: current });
  }, [img, current]);

  useEffect(() => {
    show(document.body);
    loadAssets().then((results) => {
      setAssets(results);
      setCurrent(entityTypes[0]);
    });
  }, []);

  useEffect(() => raf(render), []);

  function handleEntityChange(value: EntityType) {
    // TODO when empty, could close the scrollable@AssetPicker
    if (!value || value.trim() === "") return;
    setImg(undefined);
    setCurrent(value);
  }

  let parameters;
  switch (current) {
    // case "Boss":
    //   parameters = <BossParameters />;
    //   break;
    case "Ship":
      parameters = <ShipParameters />;
      break;
    case "Rock":
      parameters = <RockParameters />;
      break;
  }

  return (
    <div className="main">
      <h3 className="title">Main</h3>
      <div className="partition">
        <Stats />
      </div>
      <h3 className="title">Debug</h3>
      <div className="partition">
        <Debug update={update} />
      </div>
      <h3 className="title">Asset</h3>
      <div className="partition">
        <Toggle
          type="single"
          value={current}
          onValueChange={handleEntityChange}
        >
          {entityTypes.map((type) => {
            return (
              <ToggleItem key={type} value={type}>
                {type}
              </ToggleItem>
            );
          })}
        </Toggle>
        {current && assets && (
          <AssetPicker assets={assets[current]} onPick={(img) => setImg(img)} />
        )}
      </div>
      <h3 className="title">Parameters</h3>
      <div className="partition">{parameters}</div>
    </div>
  );
}
