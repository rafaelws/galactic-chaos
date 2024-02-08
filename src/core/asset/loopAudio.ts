import { Config, ConfigKey, loadAudio } from "..";
import { events } from "../events";

export function LoopAudio() {
  const ctx: AudioContext = new AudioContext();
  const gainNode: GainNode = ctx.createGain();

  let loading = false;
  let currentTrack: AudioBufferSourceNode | null = null;

  setGain(Config.get(ConfigKey.AudioGain));
  setEnabled(Config.get(ConfigKey.AudioEnabled));

  const subscribers = [
    events.config.onAudioEnabled((isEnabled) => setEnabled(isEnabled)),
    events.config.onAudioGain((gain) => setGain(gain)),
  ];

  function setGain(amount: number) {
    const gain = amount * 0.1;
    gainNode.gain.value = gain;
  }

  function setEnabled(isEnabled: boolean) {
    if (isEnabled) {
      if (ctx.state === "suspended") ctx.resume();
    } else {
      if (ctx.state === "running") ctx.suspend();
    }
  }

  async function createTrack(buffer: ArrayBuffer) {
    const track = ctx.createBufferSource();
    track.buffer = await ctx.decodeAudioData(buffer.slice(0));
    track.connect(gainNode).connect(ctx.destination);
    return track;
  }

  async function start(assetPath: string) {
    if (loading) return;
    loading = true;
    stop();

    try {
      const buffer = await loadAudio(assetPath);
      currentTrack = await createTrack(buffer);
      currentTrack.loop = true;
      currentTrack.start();
    } catch (err) {
      // eslint-disable-next-line
      console.error(
        `could not play or load audio: ${err}\n${assetPath}`
      );
    } finally {
      loading = false;
    }
  }

  function stop() {
    try {
      currentTrack?.stop();
    } catch (err) {
      // eslint-disable-next-line
      console.error("track might not have been started, after all. \n", err);
    }
  }

  return { start, stop, subscribers };
}
