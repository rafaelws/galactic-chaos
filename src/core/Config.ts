import { Store } from "./";
import { events } from "./events";

export enum ConfigInputType {
  KeyboardAndMouse = "KM",
  Joystick = "GP",
}

export const ConfigKeys = [
  "Input",
  "AudioEnabled",
  "AudioGain",
  "BackgroundDensity",
] as const;

export type ConfigKeyString = (typeof ConfigKeys)[number];

export enum ConfigKey {
  Input = "Input",
  BackgroundDensity = "BackgroundDensity",
  AudioEnabled = "AudioEnabled",
  AudioGain = "AudioGain",
}

// TODO research the usage of unknown
// eslint-disable-next-line
export type ConfigMap = Record<ConfigKey, any>;

const storageKey = "configuration" as const;

const defaults: ConfigMap = {
  Input: ConfigInputType.KeyboardAndMouse,
  BackgroundDensity: 800,
  AudioEnabled: false,
  // On AudioManager, multiply this value by 0.1
  AudioGain: 8,
} as const;

export class Config {
  // TODO retain an 'in-memory' copy, so it does not need
  // to go for Storage every time
  public static all(): ConfigMap {
    return {
      ...defaults,
      ...Store.get(storageKey),
    };
  }

  public static get<T>(configKey: ConfigKey | ConfigKeyString) {
    return Config.all()[configKey] as T;
  }

  public static set<T>(configKey: ConfigKey | ConfigKeyString, value: T) {
    let config = Store.get(storageKey);

    if (!config) config = {};
    config[configKey] = value;

    Store.set(storageKey, config);
    events.config.pub(configKey, value);
  }
}
