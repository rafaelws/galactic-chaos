export enum EffectType {
  Heal = "Heal",
  Impact = "Impact",
  Projectile = "Projectile",
}

export type Effect = {
  type: EffectType;
  amount: number;
};
