import { styled } from "@/docs/stiches.config";
import { transitionDuration } from "@/docs/styles";

const height = 100;
const delay = "150ms";

export const AssetPreview = styled("div", {
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

export const Picker = styled("div", {
  overflowY: "auto",
  overflowX: "hidden",
  borderRadius: 2.5,
  height: 0,
  transition: "height",
  transitionDuration: delay,
  "&.open": {
    height: height * 2.5,
    transitionDelay: delay,
  },
  [`${AssetPreview}.closed + &.open`]: {
    transitionDelay: "0ms",
  },
});

export const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

export const Wrap = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-evenly",
  cursor: "pointer",
  padding: "0.25rem",
  minHeight: height,
  borderBottom: "1px solid",
  borderColor: "$gray400",

  transition: `background-color ${transitionDuration}`,
  backgroundColor: "$gray200",
  "&:hover": {
    backgroundColor: "$gray300",
  },
  "&.active": {
    backgroundColor: "$gray400",
  },
});

export const Asset = styled("img", {
  objectFit: "scale-down",
  maxHeight: height,
  maxWidth: height,
});
