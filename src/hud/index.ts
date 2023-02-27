import { ListenerMap, readEvent, set, unset } from "@/common/events";
import { GameEvent, HpEvent } from "@/objects";

function calculatePercent({ hp, maxHp }: HpEvent) {
  return hp > 0 && maxHp > 0 ? (hp / maxHp) * 100 : 0;
}

function onPlayerHp(ev: globalThis.Event) {
  const percent = calculatePercent(readEvent<HpEvent>(ev));
  const containerEl = document.getElementById("player-hp")!;
  const hpEl = containerEl.querySelector<HTMLDivElement>(".hp")!;

  containerEl.style.display = "block";

  if (percent < 25) {
    hpEl.style.backgroundColor = "var(--danger-color)";
    containerEl.style.animation = "glow 0.5s infinite";
  } else {
    hpEl.style.backgroundColor = "var(--player-color)";
    containerEl.style.animation = "glow 1.5s infinite";
  }

  hpEl.style.width = `${percent}%`;
}

function onBossHp(ev: globalThis.Event) {
  const percent = calculatePercent(readEvent<HpEvent>(ev));
  const containerEl = document.getElementById("boss-hp")!;
  if (percent <= 0) {
    containerEl.style.display = "none";
    return;
  }

  const hpEl = containerEl.querySelector<HTMLDivElement>(".hp")!;
  containerEl.style.display = "block";
  hpEl.style.backgroundColor = "var(--danger-color)";
  hpEl.style.width = `${percent}%`;
}

export function hud() {
  const listeners: ListenerMap = {
    [GameEvent.playerHp]: onPlayerHp,
    [GameEvent.bossHp]: onBossHp,
  };

  set(listeners);

  return {
    destroy() {
      unset(listeners);
    },
  };
}