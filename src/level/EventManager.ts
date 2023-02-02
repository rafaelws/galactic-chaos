import { ListenerMap, readEvent, set, unset } from "@/common/events";
import { Destroyable } from "@/common/meta";
import { GameEvent, GameObject } from "@/objects";

export interface EventManagerParams {
  onSpawn: (gameObject: GameObject) => void;
}

export class EventManager implements Destroyable {
  private listeners: ListenerMap = {};

  constructor(private params: EventManagerParams) {
    this.setupListeners();
  }

  public destroy(): void {
    unset(this.listeners);
  }

  private setupListeners() {
    this.listeners = {
      [GameEvent.spawn]: this.spawnProjectile.bind(this),
    };
    set(this.listeners);
  }

  private spawnProjectile(ev: globalThis.Event) {
    this.params.onSpawn(readEvent<GameObject>(ev));
  }
}
