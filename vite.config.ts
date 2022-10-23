import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from "vite-plugin-vuetify";

import { VitePWA } from "vite-plugin-pwa";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Referrer-Policy": "no-referrer",
    },
  },
  define: {
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: false,
  },
  optimizeDeps: {
    disabled: false,
  },
  build: {
    minify: "esbuild",
    commonjsOptions: {
      include: [],
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
    legalComments: "none",
    format: "esm",
  },
  css: {
    devSourcemap: true,
  },
  json: {
    stringify: true,
  },
  appType: "spa",
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    mkcert(),
    VitePWA({
      devOptions: {
        enabled: false,
      },
      injectRegister: "inline",
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
        description: "Helps users keep track of their tab",
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
        globPatterns: ["**/*.{js,css,png,svg,ico,webmanifest}"],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // cache google profile images
          {
            urlPattern: /^https:\/\/www\.googleapis.com\/plus\/v1\/people\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-profile-cache",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/(.*\.googleusercontent\.com\/.*)/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-profile-images",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 30, // <== 1 month
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      utils: fileURLToPath(new URL("./src/utils", import.meta.url)),
      types: fileURLToPath(new URL("./src/types", import.meta.url)),
    },
  },
});
