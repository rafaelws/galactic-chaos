import { trigger } from "./events";
import { Store } from "./Store";

export namespace Config {
  const storageKey = "configuration";

  export type Map = { [ix in Key]: any };

  export enum Input {
    KeyboardAndMouse = "KM",
    Joystick = "GP",
  }

  export enum Key {
    Input = "Input",
    BackgroundDensity = "BackgroundDensity",
    AudioEnabled = "AudioEnabled",
    AudioGain = "AudioGain",
  }

  const defaults: Map = {
    Input: Input.KeyboardAndMouse,
    BackgroundDensity: 1000,
    AudioEnabled: false,
    // On AudioManager, multiply this value by 0.1
    AudioGain: 8,
  } as const;

  export function all() {
    return {
      ...defaults,
      ...Store.get(storageKey),
    };
  }

  export function get<T>(key: Key) {
    return all()[key] as T;
  }

  export function set<T>(key: Key, value: T) {
    let config = Store.get(storageKey);

    if (!config) config = {};
    config[key] = value;

    Store.set(storageKey, config);
    trigger(key, value);
  }
}
