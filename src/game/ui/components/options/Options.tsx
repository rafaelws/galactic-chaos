import "./styles.css";

import { createSignal, onCleanup, onMount } from "solid-js";

import { Config, ConfigKeys } from "@/core";
import { Destroyable } from "@/core/meta";
import { throttle } from "@/core/util";

import { readInput, TriggerOnInput } from "../../readInput";
import { Slider, SliderCtrl, SliderParams } from "./Slider";
import { Toggle } from "./Toggle";

export function Options() {
  const config = Config.all();
  const props = ConfigKeys.slice(1);

  // use ref to control animation

  const [audioEnabled, setAudioEnabled] = createSignal(config.AudioEnabled);
  const [audioGain, setAudioGain] = createSignal(config.AudioGain);
  const [backgroundDensity, setBackgroundDensity] = createSignal(
    config.BackgroundDensity
  );

  const [activeIx, setActiveIx] = createSignal(0);

  const gainSlider: SliderParams = {
    value: audioGain(),
    min: 0,
    step: 1,
    max: 10,
  };
  const gainCtrl = SliderCtrl(gainSlider);

  const densitySlider: SliderParams = {
    value: backgroundDensity(),
    min: 0,
    step: 100,
    max: 1400,
  };
  const densityCtrl = SliderCtrl(densitySlider);

  const up = () => {
    setActiveIx((prev) => {
      if (--prev < 0) prev = props.length - 1;
      return prev;
    });
  };

  const down = () => {
    setActiveIx((prev) => {
      if (++prev > props.length - 1) prev = 0;
      return prev;
    });
  };

  // FIXME values are changing too fast (20ms);
  // TODO check value before changing or debounce
  const changeValue = (operation: "+" | "-") => {
    // eslint-disable-next-line
    let val: any = undefined;
    const ix = activeIx();
    if (ix === 0)
      setAudioEnabled((prev) => {
        val = operation === "+" ? true : false;
        return prev === val ? prev : val;
      });
    else if (ix === 1)
      setAudioGain((prev) => {
        val = gainCtrl(prev, operation);
        return val;
      });
    else if (ix === 2)
      setBackgroundDensity((prev) => {
        val = densityCtrl(prev, operation);
        return val;
      });

    if (val !== undefined) Config.set(props[ix], val);
  };

  const left = () => changeValue("-");
  const right = () => changeValue("+");

  let inputReader: Destroyable | null = null;
  const inputs: TriggerOnInput[] = [
    { action: "D_UP", destroyOnHit: false, fn: throttle(up, 150) },
    { action: "L_UP", destroyOnHit: false, fn: throttle(up, 150) },
    { action: "L_DOWN", destroyOnHit: false, fn: throttle(down, 150) },
    { action: "D_DOWN", destroyOnHit: false, fn: throttle(down, 150) },

    { action: "D_LEFT", destroyOnHit: false, fn: throttle(left, 20) },
    { action: "L_LEFT", destroyOnHit: false, fn: throttle(left, 20) },
    { action: "D_RIGHT", destroyOnHit: false, fn: throttle(right, 20) },
    { action: "L_RIGHT", destroyOnHit: false, fn: throttle(right, 20) },
  ];

  onMount(() => {
    inputReader = readInput(inputs);
  });

  onCleanup(() => {
    inputReader?.destroy();
  });

  return (
    <div id="options">
      <div class="field" classList={{ active: activeIx() === 0 }}>
        <span>Enable Audio</span>
        <Toggle active={audioEnabled()} />
      </div>
      <div class="field" classList={{ active: activeIx() === 1 }}>
        <span>Audio Volume</span>
        <Slider {...gainSlider} value={audioGain()} />
      </div>
      <div class="field" classList={{ active: activeIx() === 2 }}>
        <span>Background Density</span>
        <Slider {...densitySlider} value={backgroundDensity()} />
      </div>
    </div>
  );
}
