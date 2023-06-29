import { CSS } from "@stitches/react";

import { styled } from "./stiches.config";

export const transitionDuration = "250ms";

export const Controls = styled("div", {
  fontSize: 11,
  fontFamily: "$mono",
  backgroundColor: "$gray100",
  color: "$gray600",

  position: "absolute",
  top: ".5rem",
  right: ".5rem",
  width: 200,
  borderRadius: 2.5,
  zIndex: 1,
});

export const Title = styled("h3", {
  fontFamily: "$mono",
  fontSize: ".75rem",
  width: "100%",
  padding: ".25rem .5rem",
  color: "$gray800",
  backgroundColor: "$gray200",
  borderLeft: "5px solid",
  borderLeftColor: "$gray400",
  "&:first-child": {
    borderRadius: "2.5px 2.5px 0 0",
  },
});

export const Blade = styled("div", {
  padding: ".5rem .25rem",
});

const common: CSS = {
  // fontFamily: "$mono",
  width: "100%",
  padding: ".25rem",
  color: "$gray800",
  backgroundColor: "$gray200",
  border: "none",
  borderRadius: 2.5,
  outline: "none",
  transitionProperty: "background-color",
  transitionDuration,
};

export const Button = styled("button", {
  ...common,
  cursor: "pointer",
  backgroundColor: "$gray700",
  color: "$gray200",
  "&:hover": {
    backgroundColor: "$gray900",
  },
});

export const Label = styled("label", {
  fontFamily: "$mono",
  marginTop: ".25rem",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  "&:first-child": {
    marginTop: 0,
  },
});

export const InputText = styled("input", {
  ...common,
  marginLeft: ".25rem",
  "&:hover, &:focus": {
    backgroundColor: "$gray300",
  },
});

export const Select = styled("select", {
  ...common,
  "&:hover": {
    backgroundColor: "$gray300",
  },
  "& option": {
    fontFamily: "$mono",
    backgroundColor: "$gray200",
  },
  "& option:checked": {
    backgroundColor: "$gray400",
    color: "$gray900",
  },
});
