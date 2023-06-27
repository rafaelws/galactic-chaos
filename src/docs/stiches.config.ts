import { createStitches } from "@stitches/react";

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      gray100: "#28292E", // bg
      gray200: "#37383D", // header/input bg
      gray300: "#3E3F44", // header/input bg highlight
      gray400: "#44454b",
      gray500: "#717379",
      // gray600: "#76777e",
      gray600: "#797A80", // font color
      gray700: "#909098",
      gray800: "#A3A4AC", // input font color
      // gray900: "#afb0b7",
      gray900: "#A8A9B1", // input font highlight
    },
    fonts: {
      mono: "Roboto Mono, Source Code Pro, Menlo, Courier, monospace",
    },
  },
});
