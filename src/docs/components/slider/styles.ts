import * as Slider from "@radix-ui/react-slider";

import { styled } from "@/docs/stiches.config";
import { backgroundColor, InputText, transitionDuration } from "@/docs/styles";

export const Container = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const Input = styled(InputText, {
  height: "1rem",
  maxWidth: "2.5rem",
  textAlign: "right",
});

export const Root = styled(Slider.Root, {
  position: "relative",
  display: "flex",
  alignItems: "center",
  userSelect: "none",
  touchAction: "none",

  height: "100%",
  marginTop: "0.25rem",
});

export const Track = styled(Slider.Track, {
  flexGrow: 1,
  position: "relative",
  height: 10,
  backgroundColor,
  borderRadius: 1.5,
});

export const Range = styled(Slider.Range, {
  position: "absolute",
  height: "100%",
  borderRadius: 1.5,
  backgroundColor: "$gray600",
});

export const Thumb = styled(Slider.Thumb, {
  outline: "none",
  display: "block",
  width: 10,
  height: 10,
  backgroundColor: "$gray700",
  borderRadius: 1.5,

  transition: `background-color ${transitionDuration}`,
  "&:hover": {
    backgroundColor: "$gray900",
  },
  "&:focus": {
    outline: "none",
  },
});
