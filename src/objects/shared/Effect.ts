export type Effect = {
  type: "HEAL" | "SHIELD" | "IMPACT" | "PROJECTILE";
  amount: number;
};
