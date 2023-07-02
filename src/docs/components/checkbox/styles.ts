import * as Checkbox from "@radix-ui/react-checkbox";

import { styled } from "@/docs/stiches.config";
import { color, inputColors } from "@/docs/styles";

import { ReactComponent as Icon } from "./check.svg";

export const CheckIcon = styled(Icon, {
  color,
});

export const CheckboxRoot = styled(Checkbox.Root, {
  all: "unset",
  width: 15,
  height: 15,
  borderRadius: 1.5,
  ...inputColors,
});

export const CheckboxIndicator = styled(Checkbox.Indicator, {
  color,
});
