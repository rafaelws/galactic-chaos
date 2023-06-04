import { Store } from "./Store";
import { pub } from "./events";

export enum ConfigInputType {
  KeyboardAndMouse = "KM",
  Joystick = "GP",
}

export enum ConfigKey {
  Input = "Input",
  BackgroundDensity = "BackgroundDensity",
  AudioEnabled = "AudioEnabled",
  AudioGain = "AudioGain",
}

export type ConfigMap = { [ix in ConfigKey]: any };

const storageKey = "configuration";

const defaults: ConfigMap = {
  Input: ConfigInputType.KeyboardAndMouse,
  BackgroundDensity: 1000,
  AudioEnabled: false,
  // On AudioManager, multiply this value by 0.1
  AudioGain: 8,
} as const;

export class Config {

  public static all() {
    return {
      ...defaults,
      ...Store.get(storageKey),
    };
  }

  public static get<T>(key: ConfigKey) {
    return Config.all()[key] as T;
  }

  public static set<T>(key: ConfigKey, value: T) {
    let config = Store.get(storageKey);

    if (!config) config = {};
    config[key] = value;

    Store.set(storageKey, config);
    pub(key, value);
  }
}
