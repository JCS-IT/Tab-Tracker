import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "@vuetify/vite-plugin";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from 'vite-plugin-mkcert'
import { terser } from 'rollup-plugin-terser';

const path = require("path");

export default defineConfig({
  server: { https: true },
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
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
        start_url: ".",
        display: "standalone",
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
        sourcemap: true,
      },
      devOptions: {
        enabled: false,
        type: "module",
      },
    }),
    mkcert(),
    terser({
      compress: {
        drop_console: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        passes: 2,
      },
      format: {
        comments: false,
        ecma: '2020',
      },
    }),
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@prompts": path.resolve(__dirname, "src/components/prompts"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@views": path.resolve(__dirname, "src/views"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
});
