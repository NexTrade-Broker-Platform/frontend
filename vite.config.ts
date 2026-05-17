import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const apiProxyTarget = process.env.VITE_DEV_API_PROXY_TARGET ?? "http://localhost:9000";
const wsProxyTarget = process.env.VITE_DEV_WS_PROXY_TARGET ?? "ws://localhost:9006";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: true,
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
      "/ws": {
        target: wsProxyTarget,
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
