import "./styles.css";

import { useEffect, useState } from "react";

import { classNames } from "@/docs/util";

import { Scrollable } from "..";

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
    <div className="asset-picker">
      <div
        onClick={handleClick}
        className={
          "preview " +
          classNames({
            open: previewOpen,
            closed: !previewOpen,
          })
        }
      >
        {current && <img className="asset" src={current.src} />}
      </div>
      <ul className={"list " + openClassName}>
        <Scrollable>
          {assets.map((img) => (
            <li
              key={img.src}
              className={
                "item colors " +
                classNames({ active: current?.src === img.src })
              }
              onClick={() => handlePick(img)}
            >
              <img className="asset" src={img.src} />
            </li>
          ))}
        </Scrollable>
      </ul>
      <button className={openClassName} onClick={handleClick}>
        Close
      </button>
    </div>
  );
}
