import "./styles.css";

import { Root, Scrollbar, Thumb, Viewport } from "@radix-ui/react-scroll-area";
import { PropsWithChildren } from "react";

export function Scrollable({ children }: PropsWithChildren) {
  return (
    <Root className="scrollable" type="always">
      <Viewport className="viewport">{children}</Viewport>
      <Scrollbar className="bar" orientation="vertical">
        <Thumb className="thumb" />
      </Scrollbar>
    </Root>
  );
}
