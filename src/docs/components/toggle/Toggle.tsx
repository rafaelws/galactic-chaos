import "./styles.css";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import React from "react";

type ToggleItemProps = React.PropsWithChildren<
  React.ComponentProps<typeof ToggleGroup.Item>
>;

export function ToggleItem({ children, ...props }: ToggleItemProps) {
  return (
    <ToggleGroup.Item className="common colors item" {...props}>
      {children}
    </ToggleGroup.Item>
  );
}

type ToggleProps = React.PropsWithChildren<
  React.ComponentProps<typeof ToggleGroup.Root>
>;

export function Toggle({ children, ...props }: ToggleProps) {
  return (
    <ToggleGroup.Root className="toggle" {...props}>
      {children}
    </ToggleGroup.Root>
  );
}
