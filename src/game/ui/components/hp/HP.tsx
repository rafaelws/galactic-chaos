import "./styles.css";

import { createSignal, onCleanup, onMount, Show } from "solid-js";

import { UnsubFn } from "@/core";
import { events, HpEvent } from "@/core/events";

const map = {
  boss: {
    id: "boss-hp",
    event: "onBossHp",
  },
  player: {
    id: "player-hp",
    event: "onPlayerHp",
  },
} as const;

function calculatePercent({ hp, maxHp }: HpEvent) {
  return hp > 0 && maxHp > 0 ? (hp / maxHp) * 100 : 0;
}

interface HpBarParams {
  type: "boss" | "player";
}

export function Hp({ type }: HpBarParams) {
  const { id, event } = map[type];

  let unsub: UnsubFn | null;
  const [hp, setHp] = createSignal(0);

  function onHp(ev: HpEvent) {
    setHp(calculatePercent(ev));
  }

  onMount(() => {
    unsub = events.game[event](onHp);
  });

  onCleanup(() => {
    if (unsub) unsub();
  });

  return (
    <Show when={hp() > 0}>
      <div id={id} class="hp-container" classList={{ danger: hp() < 25 }}>
        <div class="hp" style={{ width: `${hp()}%` }}></div>
      </div>
    </Show>
  );
}
