import * as ScrollArea from "@radix-ui/react-scroll-area";

import { styled } from "@/docs/stiches.config";
import { backgroundTransition } from "@/docs/styles";

const SCROLLBAR_SIZE = 8;

export const ScrollAreaRoot = styled(ScrollArea.Root, {
  width: "inherit",
  height: "inherit",
  borderRadius: "inherit",
  overflow: "hidden",
});

export const ScrollAreaViewport = styled(ScrollArea.Viewport, {
  width: "100%",
  height: "100%",
  borderRadius: "inherit",
});

export const ScrollAreaScrollbar = styled(ScrollArea.Scrollbar, {
  display: "flex",
  // ensures no selection
  userSelect: "none",
  // disable browser handling of all panning
  // and zooming gestures on touch devices
  touchAction: "none",
  padding: 2,
  // transition: backgroundTransition,
  // backgroundColor: "$gray000",
  // "&:hover": { backgroundColor: "$gray100" },
  "&[data-orientation=vertical]": { width: SCROLLBAR_SIZE },
  // "&[data-orientation=horizontal]": {
  //   flexDirection: "column",
  //   height: SCROLLBAR_SIZE,
  // },
});

export const ScrollAreaThumb = styled(ScrollArea.Thumb, {
  flex: 1,
  transition: backgroundTransition,
  background: "$gray700",
  "&:hover": {
    background: "$gray900",
  },
  borderRadius: 1.5,
  // borderRadius: SCROLLBAR_SIZE,
  // increase target size for touch devices
  // https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
  position: "relative",
  "&::before": {
    content: "",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    minWidth: 50,
    minHeight: 50,
  },
});

export const ScrollAreaCorner = styled(ScrollArea.Corner, {
  background: "red",
});
