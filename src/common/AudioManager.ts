import { Destroyable } from "@/common/meta";
import { ListenerMap, readEvent, set, unset } from "@/common/events";
import { getAudio } from "@/common/asset";

export interface MainstreamEvent {
  filePath: string;
  loop?: boolean;
}

export const AudioEvent = {
  mainStream: "audio:mainstream",
  enable: "audio:enable",
  pause: "audio:pause",
  resume: "audio:resume",
  // effect: "audio:effect",
} as const;

export class AudioManager implements Destroyable {
  private ctx: AudioContext;

  private listeners: ListenerMap;

  private lastEvent: MainstreamEvent | null = null;
  private currentTrack: AudioBufferSourceNode | null = null;
  private currentTrackPlayDate: number = 0;
  private currentTrackTimePast: number = 0;

  constructor() {
    this.listeners = this.setupListeners();
    this.ctx = new AudioContext();
  }

  private setupListeners() {
    const listeners = {
      [AudioEvent.mainStream]: (ev: globalThis.Event) => {
        this.mainStream(readEvent<MainstreamEvent>(ev));
      },
      [AudioEvent.pause]: (ev: globalThis.Event) => {
        this.pause(readEvent<MainstreamEvent>(ev));
      },
      [AudioEvent.resume]: (_: globalThis.Event) => {
        this.resume();
      },
      [AudioEvent.enable]: (_: globalThis.Event) => {
        this.ctx.resume();
      },
    };
    set(listeners);
    return listeners;
  }

  public destroy(): void {
    unset(this.listeners);
  }

  private async createTrack(buffer: ArrayBuffer) {
    const track = this.ctx.createBufferSource();
    track.buffer = await this.ctx.decodeAudioData(buffer.slice(0));
    track.connect(this.ctx.destination);
    return track;
  }

  private async prepareTrack(ev: MainstreamEvent) {
    const { filePath, loop = false } = ev;

    if (!!this.currentTrack) {
      this.currentTrack.stop();
      this.currentTrack = null;
    }

    try {
      const arrayBuffer = getAudio(filePath);
      const track = await this.createTrack(arrayBuffer);
      track.loop = loop;
      this.currentTrack = track;
    } catch (err) {
      console.error(`AudioManager - could not play audio: ${err}\n${filePath}`);
    }
  }

  private async mainStream(ev: MainstreamEvent) {
    if (this.lastEvent?.filePath !== ev.filePath) {
      this.currentTrackTimePast = 0;
    }
    await this.prepareTrack(ev);
    this.currentTrack?.start(0, this.currentTrackTimePast || 0);

    this.currentTrackPlayDate = Date.now();
    this.lastEvent = ev;
  }

  private async pause(ev: MainstreamEvent) {
    this.currentTrackTimePast +=
      (Date.now() - this.currentTrackPlayDate) * 0.001;

    await this.prepareTrack(ev);
    this.currentTrack?.start();
  }

  private async resume() {
    if (!!this.lastEvent) this.mainStream(this.lastEvent);
  }
}
