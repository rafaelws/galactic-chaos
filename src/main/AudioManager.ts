import { Config } from "@/common";
import { assets, getAudio } from "@/common/asset";
import { readEvent, set } from "@/common/events";

export namespace AudioManager {
  interface AudioRequestEvent {
    assetPath: string;
    loop?: boolean;
  }

  let ctx: AudioContext = new AudioContext();
  let gainNode: GainNode = ctx.createGain();

  let lastEvent: AudioRequestEvent | null = null;
  let currentTrack: AudioBufferSourceNode | null = null;
  let currentTrackPlayDate: number = 0;
  let currentTrackTimePast: number = 0;

  let enabled = false;

  setGain(Config.get(Config.Key.AudioGain));
  setEnabled(Config.get(Config.Key.AudioEnabled));

  set({
    [Config.Key.AudioGain]: (ev: globalThis.Event) => {
      setGain(readEvent<number>(ev));
    },
    [Config.Key.AudioEnabled]: (ev: globalThis.Event) => {
      setEnabled(readEvent<boolean>(ev));
    },
  });

  async function createTrack(buffer: ArrayBuffer) {
    const track = ctx.createBufferSource();
    track.buffer = await ctx.decodeAudioData(buffer.slice(0));
    track.connect(gainNode).connect(ctx.destination);
    return track;
  }

  async function prepareTrack(ev: AudioRequestEvent) {
    const { assetPath, loop = false } = ev;

    if (!!currentTrack) {
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

  export async function play(assetPath: string, loop?: boolean) {
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

  export async function pause(
    assetPath = assets.audio.menu.pause,
    loop = true
  ) {
    currentTrackTimePast += (Date.now() - currentTrackPlayDate) * 0.001;

    await prepareTrack({ assetPath, loop });
    currentTrack?.start();

    setEnabled(enabled);
  }

  export async function resume() {
    if (!!lastEvent) play(lastEvent.assetPath, lastEvent.loop);
  }

  export function setGain(amount: number) {
    const gain = amount * 0.1;
    gainNode.gain.value = gain;
  }

  export function setEnabled(_enabled: boolean) {
    // if (enabled === enabled) return;
    enabled = _enabled;

    if (_enabled) {
      if (ctx.state === "suspended") ctx.resume();
    } else {
      if (ctx.state === "running") ctx.suspend();
    }
  }
}
