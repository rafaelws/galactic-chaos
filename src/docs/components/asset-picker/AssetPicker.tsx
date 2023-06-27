import { useState } from "react";

import { styles } from "./styles";

interface Props {
  assets: HTMLImageElement[];
  onPick: (img: HTMLImageElement) => void;
}

export function AssetPicker({ assets, onPick }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [current, setCurrent] = useState<HTMLImageElement>();

  const isOpenClass = open ? "open" : "";

  const isActiveClass = (img: HTMLImageElement) =>
    current?.src === img.src ? "active" : "";

  const handleClick = () => setOpen(!open);

  function handlePick(img: HTMLImageElement) {
    onPick(img);
    setCurrent(img);
    setOpen(false);
  }

  return (
    <>
      <button onClick={handleClick}>Asset Picker</button>
      <styles.AssetPreview onClick={handleClick} className={isOpenClass}>
        {current && <styles.Asset src={current.src} />}
      </styles.AssetPreview>
      <styles.AssetPicker className={isOpenClass}>
        <styles.Container>
          {assets.map((img) => (
            <styles.Wrap
              key={img.src}
              className={isActiveClass(img)}
              onClick={() => handlePick(img)}
            >
              <styles.Asset src={img.src} />
            </styles.Wrap>
          ))}
        </styles.Container>
      </styles.AssetPicker>
    </>
  );
}
