import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
  plugins: [react(), commonjs()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),

      process: "process/browser",
      buffer: "buffer",
      util: "util",
      events: "events",

      // 🔥 IMPORTANT FIX FOR simple-peer
      stream: "stream-browserify",
    },
  },

  define: {
    global: "globalThis",
  },

  optimizeDeps: {
    include: [
      "process",
      "buffer",
      "events",
      "util",
      "stream-browserify",
    ],
  },
});