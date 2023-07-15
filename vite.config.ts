/// <reference types="vitest" />
import preact from "@preact/preset-vite";
import { resolve } from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), preact()],
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
