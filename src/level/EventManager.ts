import { GameEvent, ListenerMap, readEvent, set, unset } from "@/common/events";
import { Destroyable } from "@/common/meta";
import { Projectile, ProjectileParams } from "@/objects";

export type OnProjectile = {
  (projectile: Projectile): void;
};

export interface EventManagerParams {
  onEnemyProjectile: OnProjectile;
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
      [GameEvent.spawnEnemyProjectile]:
        this.spawnEnemyProjectileEvent.bind(this),
    };
    set(this.listeners);
  }

  private spawnEnemyProjectileEvent(ev: globalThis.Event) {
    const params = readEvent<ProjectileParams>(ev);
    this.params.onEnemyProjectile(new Projectile(params));
  }
}
