import { trigger } from "./events";
import { Store } from "./Store";

export namespace Config {
  const storageKey = "configuration";

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

  const defaults: { [ix in Key]: any } = {
    Input: Input.KeyboardAndMouse,
    BackgroundDensity: 2000,
    AudioEnabled: false,
    AudioGain: 0.8,
  } as const;

  export function get<T>(key: Key) {
    return {
      ...defaults,
      ...Store.get(storageKey),
    }[key] as T;
  }

  export function set<T>(key: Key, value: T) {
    const config = Store.get(storageKey);
    config[key] = value;
    Store.set(storageKey, config);
    trigger(key, value);
  }
}
