import { p } from "@/core/meta";
import { BossPhase } from "@/core/objects";
import { quadraticBezier } from "@/core/objects/shared";

export const firstPhase = (): BossPhase => ({
  nextPhaseCondition: ({ hp, maxHp }) => hp <= maxHp * 0.8,
  impact: { collisionTimeout: 1000 },
  fire: { rate: 50 },
  movement: quadraticBezier(p(0, 0), p(0.5, 1), p(1, 0), 3)
    .linear(p(1, 0), p(0.15, 0.15), 5)
    .linear(p(0.15, 0.15), p(1, 0.3), 5)
    .quadraticBezier(p(1, 0), p(0.5, 1), p(0, 0), 3)
    .linear(p(0, 0), p(0.85, 0.15), 5)
    .linear(p(0.85, 0.15), p(0, 0.3), 5)
    .repeatable(),
});
