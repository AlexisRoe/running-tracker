import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import pkg from "./package.json";
import { alias, define } from "./vite-shared.config";

export default defineConfig({
  publicDir: "public",
  resolve: {
    alias,
  },
  define,
  build: {
    assetsDir: "assets",
  },
  server: {
    port: 5173,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["assets/favicon.ico", "assets/icons/*"],
      manifest: {
        name: "Running Tracker",
        short_name: "RunTracker",
        description: pkg.description,
        theme_color: "#e45900",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          { src: "/assets/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/assets/icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
          { src: "/assets/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/assets/icons/icon-192x192-maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/assets/icons/icon-512x512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
});
