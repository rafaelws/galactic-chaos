import { useEffect, useState } from "react";

import { raf, show } from "@/core/dom";

import {
  AssetPicker,
  BossParameters,
  Debug,
  RockParameters,
  Stats,
  Toggle,
  ToggleItem,
} from "./components";
import { setupRender } from "./render";
import { Blade, Controls, Title } from "./styles";
import { Assets, EntityType, entityTypes, getAssets } from "./util";

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
    getAssets().then((results) => {
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
    <Controls>
      <Title>Main</Title>
      <Blade>
        <Stats />
      </Blade>
      <Title>Debug</Title>
      <Blade>
        <Debug update={update} />
      </Blade>
      <Title>Asset</Title>
      <Blade>
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
      </Blade>
      <Title>Parameters</Title>
      <Blade>{parameters}</Blade>
    </Controls>
  );
}
