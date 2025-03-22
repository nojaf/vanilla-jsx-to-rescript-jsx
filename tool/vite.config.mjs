import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022", // napi-rs wasi-browser.js output relies on top-level await
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2022", // napi-rs wasi-browser.js output relies on top-level await
    },
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
