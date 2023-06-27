import { styled } from "./stiches.config";

const Control = styled("div", {
  fontSize: 11,
  fontFamily: "$mono",
  backgroundColor: "$gray100",
  color: "$gray600",

  position: "absolute",
  top: "1rem",
  right: "1rem",
  padding: ".25rem",
  width: 200,
  zIndex: 1,
  borderRight: "1px solid black",
  borderRadius: 2.5,
});

const Blade = styled("div", {
  padding: ".25rem .25rem 0",

  "& select, & input, & button": {
    fontFamily: "$mono",
    width: "100%",
    padding: ".25rem",
    color: "$gray800",
    backgroundColor: "$gray200",
    border: "none",
    borderRadius: 2.5,
    outline: "none",
  },
  "& button": {
    cursor: "pointer",
    backgroundColor: "$gray700",
    color: "$gray200",
  },
  "& button:hover": {
    backgroundColor: "$gray900",
  },
  "& select:hover, & input:hover": {
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

export const styles = { Control, Blade };
