import { Config, ConfigKey } from "..";
import { AudioRequest, events } from "../events";
import { assets } from ".";
import { LoopAudio } from "./loopAudio";

type InControl = "loop" | "track" | "none";

type PauseStats = {
  audioTrack: AudioRequest;
  enabled?: boolean;
};

export function audioManager(audioRef: HTMLAudioElement) {
  const loopAudio = LoopAudio();

  let enabled = false;
  let levelTime = 0;
  let inControl: InControl = "none";

  let audioTrack: AudioRequest = {
    track: "",
    loop: false,
  };

  const pauseStats: PauseStats = {
    audioTrack: { track: assets.audio.menu.pause, loop: true },
    enabled: false,
  };

  setGain(Config.get(ConfigKey.AudioGain));
  setEnabled(Config.get(ConfigKey.AudioEnabled));

  const subscribers = [
    events.config.onAudioEnabled((isEnabled) => setEnabled(isEnabled)),
    events.config.onAudioGain((gain) => setGain(gain)),
    events.game.onLevelTime((time) => setLevelTime(time)),
    events.audio.onPlay(play),
    events.audio.onPause(pause),
    events.audio.onResume(resume),
    ...loopAudio.subscribers,
  ];

  function setLevelTime(time: number) {
    levelTime = time;
  }

  function setGain(amount: number) {
    audioRef.volume = amount * 0.1;
  }

  function setEnabled(isEnabled: boolean) {
    if (isEnabled === enabled) return;
    enabled = isEnabled;

    // edge case
    if (inControl === "loop" && pauseStats.enabled) play(pauseStats.audioTrack);
    else isEnabled ? audioRef.play() : audioRef.pause();
  }

  function play({ track, loop = false }: AudioRequest) {
    loopAudio.stop();
    audioRef.pause();

    loop ? playLoop(track) : playTrack(track);
  }

  function playTrack(track: string) {
    inControl = "track";
    audioTrack = { track, loop: false };
    audioRef.src = track;

    if (!enabled) return;

    audioRef.currentTime = levelTime * 0.001;
    audioRef.play();
  }

  function playLoop(loop: string) {
    inControl = "loop";
    // avoid loop files from being downloaded if enabled=false
    // (pause is an edge case; see setEnabled above)
    if (!enabled) return;
    loopAudio.start(loop);
  }

  function pause() {
    pauseStats.enabled = true;
    play(pauseStats.audioTrack);
  }

  function resume() {
    pauseStats.enabled = false;
    play(audioTrack);
  }

  return subscribers;
}
