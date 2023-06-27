import classNames from "classnames";
import { useState } from "react";

import { styles } from "./styles";

interface Props {
  assets: HTMLImageElement[];
  onPick: (img: HTMLImageElement) => void;
}

export function AssetPicker({ assets, onPick }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [current, setCurrent] = useState<HTMLImageElement>();

  const previewOpen = !open && !!current;

  const handleClick = () => setOpen(!open);

  function handlePick(img: HTMLImageElement) {
    onPick(img);
    setCurrent(img);
    setOpen(false);
  }

  return (
    <>
      <button onClick={handleClick}>Choose an Asset</button>
      <styles.AssetPreview
        onClick={handleClick}
        className={classNames({
          open: previewOpen,
          closed: !previewOpen,
        })}
      >
        {current && <styles.Asset src={current.src} />}
      </styles.AssetPreview>
      <styles.AssetPicker className={classNames({ open })}>
        <styles.Container>
          {assets.map((img) => (
            <styles.Wrap
              key={img.src}
              className={classNames({ active: current?.src === img.src })}
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
