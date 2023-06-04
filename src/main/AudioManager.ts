import { Config, ConfigKey } from "@/common";
import { assets, getAudio } from "@/common/asset";
import { readEvent, set, unset } from "@/common/events";
import { Destroyable } from "@/common/meta";

export enum AudioEvent {
  Play = "Play",
  Pause = "Pause",
  Resume = "Resume",
}

interface AudioRequestEvent {
  assetPath: string;
  loop?: boolean;
}

export function AudioManager(): Destroyable {
  const ctx: AudioContext = new AudioContext();
  const gainNode: GainNode = ctx.createGain();

  let lastEvent: AudioRequestEvent | null = null;
  let currentTrack: AudioBufferSourceNode | null = null;
  let currentTrackPlayDate = 0;
  let currentTrackTimePast = 0;

  let enabled = false;

  setGain(Config.get(ConfigKey.AudioGain));
  setEnabled(Config.get(ConfigKey.AudioEnabled));

  const listeners = {
    [AudioEvent.Play]: (ev: globalThis.Event) =>
      play(readEvent<AudioRequestEvent>(ev)),
    [AudioEvent.Pause]: () => pause(),
    [AudioEvent.Resume]: () => resume(),
    [ConfigKey.AudioGain]: (ev: globalThis.Event) => {
      setGain(readEvent<number>(ev));
    },
    [ConfigKey.AudioEnabled]: (ev: globalThis.Event) => {
      setEnabled(readEvent<boolean>(ev));
    },
  };

  set(listeners);

  async function createTrack(buffer: ArrayBuffer) {
    const track = ctx.createBufferSource();
    track.buffer = await ctx.decodeAudioData(buffer.slice(0));
    track.connect(gainNode).connect(ctx.destination);
    return track;
  }

  async function prepareTrack(ev: AudioRequestEvent) {
    const { assetPath, loop = false } = ev;

    if (currentTrack) {
      currentTrack.stop();
      currentTrack = null;
    }

    try {
      const arrayBuffer = getAudio(assetPath);
      const track = await createTrack(arrayBuffer);
      track.loop = loop;
      currentTrack = track;
    } catch (err) {
      console.error(
        `AudioManager - could not play audio: ${err}\n${assetPath}`
      );
    }
  }

  async function play(ev: AudioRequestEvent) {
    const { assetPath, loop } = ev;

    if (lastEvent?.assetPath !== assetPath) {
      currentTrackTimePast = 0;
    }
    const currentEvent = { assetPath, loop };
    await prepareTrack(currentEvent);
    currentTrack?.start(0, currentTrackTimePast || 0);

    currentTrackPlayDate = Date.now();
    lastEvent = currentEvent;

    setEnabled(enabled);
  }

  async function pause(
    assetPath = assets.audio.menu.pause,
    loop = true
  ) {
    currentTrackTimePast += (Date.now() - currentTrackPlayDate) * 0.001;

    await prepareTrack({ assetPath, loop });
    currentTrack?.start();

    setEnabled(enabled);
  }

  async function resume() {
    if (lastEvent) play(lastEvent);
  }

  function setGain(amount: number) {
    const gain = amount * 0.1;
    gainNode.gain.value = gain;
  }

  function setEnabled(_enabled: boolean) {
    // if (enabled === enabled) return;
    enabled = _enabled;

    if (_enabled) {
      if (ctx.state === "suspended") ctx.resume();
    } else {
      if (ctx.state === "running") ctx.suspend();
    }
  }

  return {
    destroy() {
      unset(listeners);
    }
  };
}