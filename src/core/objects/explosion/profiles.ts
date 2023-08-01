import { Boundaries } from "@/core/meta";

import { ProjectileColor } from "../projectile/Projectile";
import { EffectType } from "../shared";

export enum ExplosionProfileName {
  playerImpact = "PLAYER_IMPACT",
  playerProjectileImpact = "PLAYER_PROJECTILE",
  enemyProjectileImpact = "ENEMY_PROJECTILE",
  playerHeal = "PLAYER_HEAL",
  projectileImpact = "PROJECTILE_IMPACT",
}

export function inferExplosionProfile(
  effectType: EffectType
): ExplosionProfileName {
  switch (effectType) {
    case EffectType.Heal:
      return ExplosionProfileName.playerHeal;
    case EffectType.Impact:
      return ExplosionProfileName.playerImpact;
    case EffectType.Projectile:
      return ExplosionProfileName.enemyProjectileImpact;
  }
}

export type ExplosionProfile = {
  color: string;
  boundaries: Boundaries;
  amount: number;
};

export type ExplosionProfileMap = {
  [name in ExplosionProfileName]: ExplosionProfile;
};

export const explosionProfiles: ExplosionProfileMap = {
  [ExplosionProfileName.enemyProjectileImpact]: {
    color: ProjectileColor.enemy,
    amount: 25,
    boundaries: { height: 2, width: 10 },
  },
  [ExplosionProfileName.playerProjectileImpact]: {
    color: ProjectileColor.player,
    amount: 15,
    boundaries: { height: 1, width: 15 },
  },
  [ExplosionProfileName.playerImpact]: {
    color: "white",
    amount: 50,
    boundaries: { height: 1, width: 5 },
  },
  [ExplosionProfileName.playerHeal]: {
    color: "#03C04A",
    amount: 100,
    boundaries: { height: 1, width: 20 },
  },
  [ExplosionProfileName.projectileImpact]: {
    color: "#B13DBB",
    amount: 75,
    boundaries: { height: 3, width: 30 },
  },
} as const;
