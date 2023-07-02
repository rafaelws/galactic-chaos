import classNames from "classnames";
import { useEffect, useState } from "react";

import { Scrollable } from "..";
import { Asset, CloseButton, Item, List, Preview } from "./styles";

interface Props {
  assets: HTMLImageElement[];
  onPick: (img: HTMLImageElement) => void;
}

export function AssetPicker({ assets, onPick }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [current, setCurrent] = useState<HTMLImageElement>();

  useEffect(() => {
    setCurrent(assets[0]);
  }, [assets]);

  const previewOpen = !open && !!current;
  const openClassName = classNames({ open });

  const handleClick = () => setOpen(!open);

  function handlePick(img: HTMLImageElement) {
    onPick(img);
    setCurrent(img);
    setOpen(false);
  }

  return (
    <>
      <Preview
        onClick={handleClick}
        className={classNames({
          open: previewOpen,
          closed: !previewOpen,
        })}
      >
        {current && <Asset src={current.src} />}
      </Preview>
      <List className={openClassName}>
        <Scrollable>
          {assets.map((img) => (
            <Item
              key={img.src}
              className={classNames({ active: current?.src === img.src })}
              onClick={() => handlePick(img)}
            >
              <Asset src={img.src} />
            </Item>
          ))}
        </Scrollable>
      </List>
      <CloseButton className={openClassName} onClick={handleClick}>
        Close
      </CloseButton>
    </>
  );
}
