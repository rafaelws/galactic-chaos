export enum EffectType {
  heal = "HEAL",
  impact = "IMPACT",
  projectile = "PROJECTILE",
}

export type Effect = {
  type: EffectType;
  amount: number;
};
