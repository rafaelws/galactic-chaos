import { GameObject } from "@/core/objects";

import { ConfigInputType, ConfigKey, ConfigKeyString } from "./Config";
import { PubSub } from "./PubSub";

const pubSub = new PubSub();

type EmptyFn = () => void;

enum AudioEvent {
  Play = "AudioEventPlay",
  Pause = "AudioEventPause",
  Resume = "AudioEventResume",
}

export type AudioRequest = {
  track: string;
  loop?: boolean;
};

const audio = {
  play(request: AudioRequest) {
    return pubSub.pub(AudioEvent.Play, request);
  },
  onPlay(sub: (request: AudioRequest) => void) {
    return pubSub.sub(AudioEvent.Play, sub);
  },
  pause() {
    return pubSub.pub(AudioEvent.Pause);
  },
  onPause(sub: EmptyFn) {
    return pubSub.sub(AudioEvent.Pause, sub);
  },
  resume() {
    return pubSub.pub(AudioEvent.Resume);
  },
  onResume(sub: EmptyFn) {
    return pubSub.sub(AudioEvent.Resume, sub);
  },
};

export interface HpEvent {
  maxHp: number;
  hp: number;
}

enum GameEvent {
  Pause = "Pause",
  Spawn = "Spawn",
  PlayerHp = "PlayerHp",
  BossHp = "BossHp",
  Loading = "Loading",
  // no param events:
  Quit = "Quit",
  GameOver = "GameOver",
  GameEnd = "GameEnd",
  LevelTime = "LevelTime",
}

const game = {
  pause(paused: boolean) {
    pubSub.pub(GameEvent.Pause, paused);
  },
  onPause(sub: (paused: boolean) => void) {
    return pubSub.sub(GameEvent.Pause, sub);
  },

  spawn(gameObject: GameObject) {
    pubSub.pub(GameEvent.Spawn, gameObject);
  },
  onSpawn(sub: (gameObject: GameObject) => void) {
    return pubSub.sub(GameEvent.Spawn, sub);
  },

  playerHp(ev: HpEvent) {
    pubSub.pub(GameEvent.PlayerHp, ev);
  },
  onPlayerHp(sub: (ev: HpEvent) => void) {
    return pubSub.sub(GameEvent.PlayerHp, sub);
  },

  bossHp(ev: HpEvent) {
    pubSub.pub(GameEvent.BossHp, ev);
  },
  onBossHp(sub: (ev: HpEvent) => void) {
    return pubSub.sub(GameEvent.BossHp, sub);
  },

  quit() {
    pubSub.pub(GameEvent.Quit);
  },
  onQuit(sub: EmptyFn) {
    return pubSub.sub(GameEvent.Quit, sub);
  },

  over() {
    pubSub.pub(GameEvent.GameOver);
  },
  onOver(sub: EmptyFn) {
    return pubSub.sub(GameEvent.GameOver, sub);
  },

  end() {
    pubSub.pub(GameEvent.GameEnd);
  },
  onEnd(sub: EmptyFn) {
    return pubSub.sub(GameEvent.GameEnd, sub);
  },

  loading(isLoading: boolean) {
    pubSub.pub(GameEvent.Loading, isLoading);
  },
  onLoading(sub: (isLoading: boolean) => void) {
    return pubSub.sub(GameEvent.Loading, sub);
  },

  levelTime(time: number) {
    pubSub.pub(GameEvent.LevelTime, time);
  },
  onLevelTime(sub: (time: number) => void) {
    return pubSub.sub(GameEvent.LevelTime, sub);
  },
};

const config = {
  // eslint-disable-next-line
  pub(key: ConfigKey | ConfigKeyString, value: any) {
    pubSub.pub(key, value);
  },
  onInput(sub: (inputType: ConfigInputType) => void) {
    return pubSub.sub(ConfigKey.Input, sub);
  },
  onBackgroundDensity(sub: (density: number) => void) {
    return pubSub.sub(ConfigKey.BackgroundDensity, sub);
  },
  onAudioEnabled(sub: (isEnabled: boolean) => void) {
    return pubSub.sub(ConfigKey.AudioEnabled, sub);
  },
  onAudioGain(sub: (gain: number) => void) {
    return pubSub.sub(ConfigKey.AudioGain, sub);
  },
};

export const events = {
  game,
  config,
  audio,
};
