import { CSS } from "@stitches/react";

import { styled } from "./stiches.config";

export const color = "$gray800";
export const backgroundColor = "$gray200";
export const transitionDuration = "250ms";
export const backgroundTransition = `background-color ${transitionDuration}`;

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
  color,
  backgroundColor,
  borderLeft: "5px solid",
  borderLeftColor: "$gray400",
  "&:first-child": {
    borderRadius: "2.5px 2.5px 0 0",
  },
});

export const Blade = styled("div", {
  padding: ".5rem .25rem",
});

export const Label = styled("label", {
  fontFamily: "$mono",
  marginTop: ".25rem",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  "&:first-child": {
    marginTop: 0,
  },
});

export const inputColors: CSS = {
  transitionProperty: "background-color",
  transitionDuration,
  color,
  backgroundColor,
  "&:hover, &:focus": {
    backgroundColor: "$gray300",
  },
};

export const common: CSS = {
  ...inputColors,
  fontFamily: "$mono",
  width: "100%",
  padding: ".25rem",
  border: "none",
  borderRadius: 2.5,
  outline: "none",
};

export const InputText = styled("input", {
  ...common,
  userSelect: "none",
  marginLeft: ".25rem",
  "&::selection": {
    // color
    backgroundColor: "transparent",
  },
});

export const Select = styled("select", {
  ...common,
  "& option": {
    fontFamily: "$mono",
    backgroundColor: "$gray200",
  },
  "& option:checked": {
    backgroundColor: "$gray400",
    color: "$gray900",
  },
});

export const Button = styled("button", {
  ...common,
  cursor: "pointer",
  backgroundColor: "$gray700",
  color: "$gray200",
  "&:hover": {
    backgroundColor: "$gray900",
  },
});
