import { styled } from "./stiches.config";

const Controls = styled("div", {
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

const Blade = styled("div", {
  padding: ".5rem .25rem",

  "& select, & input[type=text], & button": {
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
  "& label": {
    fontFamily: "$mono",
    marginTop: ".25rem",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    "&:first-child": {
      marginTop: 0,
    },
  },
});

export const styles = { Controls, Blade, Title };
