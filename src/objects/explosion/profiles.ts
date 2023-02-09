import { Boundaries } from "@/common/meta";
import { ProjectileColor } from "../projectile/Projectile";
import { EffectType } from "../shared";

export enum ExplosionProfileName {
  playerImpact = "PLAYER_IMPACT",
  playerProjectile = "PLAYER_PROJECTILE",
  enemyProjectile = "ENEMY_PROJECTILE",
  playerHeal = "PLAYER_HEAL",
}

export function inferExplosionProfile(
  effectType: EffectType
): ExplosionProfileName {
  switch (effectType) {
    case EffectType.heal:
      return ExplosionProfileName.playerHeal;
    case EffectType.impact:
      return ExplosionProfileName.playerImpact;
    case EffectType.projectile:
      return ExplosionProfileName.enemyProjectile;
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
  [ExplosionProfileName.enemyProjectile]: {
    color: ProjectileColor.enemy,
    amount: 25,
    boundaries: { height: 2, width: 10 },
  },
  [ExplosionProfileName.playerProjectile]: {
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
} as const;
