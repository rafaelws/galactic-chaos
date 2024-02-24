const base = import.meta.env.BASE_URL;

export const img = {
  rock: {
    brown: [
      `${base}img/rock/brown/1.png`,
      `${base}img/rock/brown/2.png`,
      `${base}img/rock/brown/3.png`,
      `${base}img/rock/brown/4.png`,
      `${base}img/rock/brown/5.png`,
      `${base}img/rock/brown/6.png`,
      `${base}img/rock/brown/7.png`,
      `${base}img/rock/brown/8.png`,
      `${base}img/rock/brown/9.png`,
      `${base}img/rock/brown/10.png`,
    ],
    grey: [
      `${base}img/rock/grey/1.png`,
      `${base}img/rock/grey/2.png`,
      `${base}img/rock/grey/3.png`,
      `${base}img/rock/grey/4.png`,
      `${base}img/rock/grey/5.png`,
      `${base}img/rock/grey/6.png`,
      `${base}img/rock/grey/7.png`,
      `${base}img/rock/grey/8.png`,
      `${base}img/rock/grey/9.png`,
      `${base}img/rock/grey/10.png`,
    ],
    giant: [
      `${base}img/rock/giant/1.png`,
      `${base}img/rock/giant/2.png`,
      `${base}img/rock/giant/3.png`,
      `${base}img/rock/giant/4.png`,
    ],
  },
  ship: {
    level1: [
      `${base}img/ship/level1/1.png`,
      `${base}img/ship/level1/2.png`,
      `${base}img/ship/level1/3.png`,
    ],
    level2: [
      `${base}img/ship/level2/1.png`,
      `${base}img/ship/level2/2.png`,
      `${base}img/ship/level2/3.png`,
    ],
    level3: [
      `${base}img/ship/level3/1.png`,
      `${base}img/ship/level3/2.png`,
      `${base}img/ship/level3/3.png`,
    ],
    level4: [
      `${base}img/ship/level4/1.png`,
      `${base}img/ship/level4/2.png`,
      `${base}img/ship/level4/3.png`,
    ],
    final: `${base}img/ship/50.png`,
  },
  player: {
    items: {
      heal: `${base}img/player/items/heal.png`,
      shield: `${base}img/player/items/shield.png`,
      special: `${base}img/player/items/special.png`,
    },
    damage: [
      `${base}img/player/damage/1.png`,
      `${base}img/player/damage/2.png`,
      `${base}img/player/damage/3.png`,
    ],
    projectile: [
      `${base}img/player/projectile/1.png`,
      `${base}img/player/projectile/2.png`,
    ],
    shield: [
      `${base}img/player/shield/1.png`,
      `${base}img/player/shield/2.png`,
      `${base}img/player/shield/3.png`,
    ],
    special: [
      `${base}img/player/special/0.png`,
      `${base}img/player/special/1.png`,
    ],
    self: `${base}img/player/self.png`,
  },
} as const;
