import { defineConfig } from "vite";

// Plugin to handle WASM file imports from node_modules
const wasmPlugin = () => ({
  name: "wasm-resolver",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.endsWith(".wasm")) {
        res.setHeader("Content-Type", "application/wasm");
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      }
      next();
    });
  },
  resolveId(id) {
    // Ensure WASM files are resolved correctly
    if (id.endsWith(".wasm")) {
      return id;
    }
    return null;
  },
});

export default defineConfig({
  plugins: [wasmPlugin()],
  build: {
    target: "es2022", // napi-rs wasi-browser.js output relies on top-level await
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".wasm")) {
            return "assets/[name][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2022", // napi-rs wasi-browser.js output relies on top-level await
    },
    exclude: ["@oxc-parser/binding-wasm32-wasi"],
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
    fs: {
      allow: [".."],
    },
  },
  assetsInclude: ["**/*.wasm"],
  worker: {
    format: "es",
  },
});
