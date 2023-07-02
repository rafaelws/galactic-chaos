import { styled } from "@/docs/stiches.config";
import { Button, inputColors, transitionDuration } from "@/docs/styles";

const height = 100;
const delay = "150ms";

export const Item = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-evenly",
  cursor: "pointer",
  padding: "0.25rem",
  minHeight: height,
  borderBottom: "1px solid",
  borderColor: "$gray400",

  ...inputColors,
  "&.active": {
    backgroundColor: "$gray400",
  },
});

export const Preview = styled("div", {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  borderRadius: 2.5,
  backgroundColor: "$gray200",
  marginTop: ".25rem",
  cursor: "pointer",

  transition: `height ${delay}, background-color ${transitionDuration}`,
  "&.closed": {
    padding: 0,
    height: 0,
  },
  "&.open": {
    transition: `
      height ${delay} ease ${delay}, background-color ${transitionDuration}`,
    padding: ".25rem",
    height,
  },
  "&:hover": {
    backgroundColor: "$gray300",
  },
});

export const List = styled("div", {
  overflow: "hidden",
  width: "100%",
  borderRadius: 2.5,
  height: 0,
  transition: "height",
  transitionDuration: delay,
  "&.open": {
    height: height * 2.5,
    transitionDelay: delay,
  },
  [`${Preview}.closed + &.open`]: {
    transitionDelay: "0ms",
  },
});

export const Asset = styled("img", {
  objectFit: "scale-down",
  maxHeight: height,
  maxWidth: height,
});

export const CloseButton = styled(Button, {
  marginTop: ".25rem",
  display: "none",
  // height: 0,
  // transition: "height",
  // transitionDuration,
  "&.open": {
    display: "block",
    // height: "auto",
  },
});
