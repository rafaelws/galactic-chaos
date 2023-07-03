import { PropsWithChildren } from "react";

import {
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "./styles";

export function Scrollable({ children }: PropsWithChildren) {
  return (
    <ScrollAreaRoot type="always">
      <ScrollAreaViewport>{children}</ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollAreaRoot>
  );
}
