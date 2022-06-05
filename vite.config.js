import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "@vuetify/vite-plugin";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";

const path = require("path");

export default defineConfig({
  server: { https: true },
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
    mkcert(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "JCS Tab Tracker",
        short_name: "JCS Tabs",
        description: "Helps staff keep track of their tab",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: false,
        sourcemap: true,
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
