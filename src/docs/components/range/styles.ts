import { CSS } from "@stitches/react";

import { styled } from "@/docs/stiches.config";
import { InputText } from "@/docs/styles";

export const Container = styled("div", {
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
});

export const Input = styled(InputText, {
  width: "2rem",
  margin: "0 .25rem",
});

const pseudoCommon: CSS = {
  content: "",
  borderRadius: 1.5,
  height: "5px",
};

export const HandleContainer = styled("div", {
  height: "100%",
  width: "100%",
  display: "flex",
  alignItems: "center",
  flexGrow: 2,
  "&::before": {
    ...pseudoCommon,
    backgroundColor: "$gray600",
    width: "50%",
  },
  "&::after": {
    ...pseudoCommon,
    backgroundColor: "$gray300",
    width: "50%",
  },
});

export const Handle = styled("div", {
  height: "1rem",
  width: "1rem",
  backgroundColor: "$gray600",
  borderRadius: 1.5,
  transition: "backgrounColor 250ms",
  "&:hover": {
    backgroundColor: "$gray800",
  },
});
