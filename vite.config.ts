/// <reference types="vitest" />
import { resolve } from "path";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), solid()],
  test: { globals: true },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        docs: resolve(__dirname, "docs.html"),
        // designer: resolve(__dirname, "designer.html"),
      },
    },
  },
});
