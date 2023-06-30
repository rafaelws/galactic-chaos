import classNames from "classnames";
import { useEffect, useState } from "react";

import { Button } from "@/docs/styles";

import { Asset, AssetPreview, Container, Picker, Wrap } from "./styles";

interface Props {
  assets: HTMLImageElement[];
  onPick: (img: HTMLImageElement) => void;
}

// TODO use @radix-ui/react-scroll-area ?
export function AssetPicker({ assets, onPick }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [current, setCurrent] = useState<HTMLImageElement>();

  useEffect(() => {
    setCurrent(assets[0]);
  }, [assets]);

  const previewOpen = !open && !!current;
  const handleClick = () => setOpen(!open);

  function handlePick(img: HTMLImageElement) {
    onPick(img);
    setCurrent(img);
    setOpen(false);
  }

  return (
    <>
      <AssetPreview
        onClick={handleClick}
        className={classNames({
          open: previewOpen,
          closed: !previewOpen,
        })}
      >
        {current && <Asset src={current.src} />}
      </AssetPreview>
      <Picker className={classNames({ open })}>
        <Container>
          {assets.map((img) => (
            <Wrap
              key={img.src}
              className={classNames({ active: current?.src === img.src })}
              onClick={() => handlePick(img)}
            >
              <Asset src={img.src} />
            </Wrap>
          ))}
        </Container>
      </Picker>
      <Button
        style={{ marginTop: ".25rem", display: open ? "block" : "none" }}
        onClick={handleClick}
      >
        Close
      </Button>
    </>
  );
}
