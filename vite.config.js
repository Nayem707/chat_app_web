import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_PROXY_TARGET || "http://localhost:5000";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"),
      },
    },
    server: {
      port: 5173,
      proxy: {
        "/api": { target: apiTarget, changeOrigin: true, secure: false },
        "/socket.io": {
          target: apiTarget,
          changeOrigin: true,
          ws: true,
          secure: false,
        },
        "/uploads": { target: apiTarget, changeOrigin: true, secure: false },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
  };
});
