import { styled } from "@/docs/stiches.config";

const height = 100;
const time = "150ms";

const AssetPreview = styled("div", {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  borderRadius: 2.5,
  backgroundColor: "$gray200",
  marginTop: ".25rem",
  cursor: "pointer",

  transitionProperty: "height, padding",
  transitionDuration: time,
  "&.closed": {
    padding: 0,
    height: 0,
    // maxHeight: 0,
  },
  "&.open": {
    transitionDelay: time,
    padding: ".25rem",
    // maxHeight: height,
    height,
  },
  "&:hover": {
    backgroundColor: "$gray300",
  },
});

const AssetPicker = styled("div", {
  overflowY: "auto",
  overflowX: "hidden",
  borderRadius: 2.5,
  height: 0,
  transition: "height",
  transitionDuration: time,
  "&.open": {
    height: height * 2.5,
    transitionDelay: time,
  },
  [`${AssetPreview}.closed + &.open`]: {
    transitionDelay: "0ms",
  },
});

const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

const Wrap = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-evenly",
  cursor: "pointer",
  padding: "0.25rem",
  minHeight: height,
  borderBottom: "1px solid",
  borderColor: "$gray500",

  backgroundColor: "$gray200",
  "&:hover": {
    backgroundColor: "$gray300",
  },
  "&.active": {
    backgroundColor: "$gray400",
  },
});

const Asset = styled("img", {
  objectFit: "scale-down",
  maxHeight: height,
  maxWidth: height,
});

export const styles = { AssetPicker, Container, Wrap, Asset, AssetPreview };
