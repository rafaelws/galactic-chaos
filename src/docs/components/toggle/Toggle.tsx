import * as ToggleGroup from "@radix-ui/react-toggle-group";
import React from "react";

import { styled } from "@/docs/stiches.config";
import { common } from "@/docs/styles";

const ToggleRoot = styled(ToggleGroup.Root, {
  display: "flex",
  justifyContent: "space-evenly",
  borderRadius: common.borderRadius,
});

export const ToggleItem = styled(ToggleGroup.Item, {
  ...common,
  borderRadius: 0,
  "&[data-state=on]": {
    backgroundColor: "$gray400",
  },
});

type Props = React.PropsWithChildren<React.ComponentProps<typeof ToggleRoot>>;

export function Toggle({ children, ...props }: Props) {
  return <ToggleRoot {...props}>{children}</ToggleRoot>;
}
