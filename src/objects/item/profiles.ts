import { assets, getImage } from "@/common/asset";
import { EffectType } from "../shared";
import { PlayerItem } from "./PlayerItem";
import { PlayerItemParams } from "./PlayerItemParams";

export function healItem(amount = 1, params?: Partial<PlayerItemParams>) {
  return new PlayerItem({
    ...params,
    img: getImage(assets.img.player.items.heal),
    effect: {
      amount,
      type: EffectType.Heal,
    },
  });
}
