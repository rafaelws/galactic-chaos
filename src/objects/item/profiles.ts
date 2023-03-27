import { assets, getImage } from "@/common/asset";
import { EffectType } from "../shared";
import { PlayerItem } from "./PlayerItem";

export function healItem(amount = 1) {
  return new PlayerItem({
    img: getImage(assets.img.player.items.heal),
    effect: {
      amount,
      type: EffectType.heal,
    },
  });
}
