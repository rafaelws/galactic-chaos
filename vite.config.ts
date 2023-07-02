/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react(), svgr()],
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
