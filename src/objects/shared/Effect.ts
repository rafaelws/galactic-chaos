export type Effect = {
  type: "HEAL" | "SHIELD" | "DAMAGE";
  amount: number;
};
