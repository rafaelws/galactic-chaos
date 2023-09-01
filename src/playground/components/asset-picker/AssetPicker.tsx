import "./styles.css";

import { createEffect, createSignal, For, Show } from "solid-js";

interface Props {
  assets: HTMLImageElement[];
  onPick: (img: HTMLImageElement) => void;
}

export function AssetPicker(props: Props) {
  const [open, setOpen] = createSignal<boolean>(false);
  const [current, setCurrent] = createSignal<HTMLImageElement>();

  createEffect(() => setCurrent(props.assets[0]));

  const previewOpen = () => !open() && !!current();
  const handleClick = () => setOpen((prev) => !prev);

  function handlePick(img: HTMLImageElement) {
    props.onPick(img);
    setCurrent(img);
    setOpen(false);
  }

  return (
    <div class="asset-picker">
      <div
        onClick={handleClick}
        class="preview"
        classList={{
          open: previewOpen(),
          closed: !previewOpen(),
        }}
      >
        <Show when={current()}>
          <img class="asset" src={current()!.src} />
        </Show>
      </div>
      <ul class="list" classList={{ open: open() }}>
        <For each={props.assets}>
          {(img) => (
            <li
              class="item colors"
              classList={{ active: current()?.src === img.src }}
              onClick={() => handlePick(img)}
            >
              <img class="asset" src={img.src} />
            </li>
          )}
        </For>
      </ul>
      <Show when={open()}>
        <button onClick={handleClick}>Close</button>
      </Show>
    </div>
  );
}
