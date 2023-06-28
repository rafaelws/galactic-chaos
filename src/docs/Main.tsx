import { ChangeEvent, useEffect, useState } from "react";

import { raf, show } from "@/core/dom";

import {
  AssetPicker,
  BossParameters,
  Debug,
  RockParameters,
  Stats,
} from "./components";
import { setupRender } from "./render";
import { styles } from "./styles";
import { Assets, EntityType, entityTypes, getAssets } from "./util";

// TODO phantom player x, y

const { render, update } = setupRender();

export function Main() {
  console.log("foo");

  const [img, setImg] = useState<HTMLImageElement>();
  const [current, setCurrent] = useState<EntityType>();
  const [assets, setAssets] = useState<Assets>();

  useEffect(() => {
    update({ img, assetType: current });
  }, [img, current]);

  useEffect(() => {
    show(document.body);
    getAssets().then((results) => {
      setAssets(results);
      setCurrent(entityTypes[0]);
    });
  }, []);

  useEffect(() => raf(render), []);

  function handleEntityChange(ev: ChangeEvent<HTMLSelectElement>) {
    setImg(undefined);
    setCurrent(ev.target.value as EntityType);
  }

  let parameters;
  switch (current) {
    case "Boss":
      parameters = <BossParameters />;
      break;
    case "Ship":
      parameters = <BossParameters />;
      break;
    case "Rock":
      parameters = <RockParameters />;
      break;
  }

  return (
    <>
      <styles.Controls>
        <styles.Title>Main</styles.Title>
        <styles.Blade>
          <Stats />
        </styles.Blade>
        <styles.Title>Debug</styles.Title>
        <styles.Blade>
          <Debug update={update} />
        </styles.Blade>
        <styles.Title>Asset</styles.Title>
        <styles.Blade>
          <select value={current} onChange={handleEntityChange}>
            {entityTypes.map((type) => {
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
        <styles.Blade>{parameters}</styles.Blade>
      </styles.Controls>
    </>
  );
}
