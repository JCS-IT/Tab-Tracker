// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: {
    enabled: true,
  },
  experimental: {
    typedPages: true,
  },
  app: {
    head: {
      charset: "utf-8",
      title: "Pulpit Pal",
      viewport: "width=device-width, initial-scale=1",
      noscript: [
        { innerHTML: "JCS Tab Tracker requires javascript to function" },
      ],
    },
  },

  vite: {
    server: {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Referrer-Policy": "no-referrer",
      },
    },
    esbuild: {
      drop:
        process.env.NODE_ENV === "development"
          ? undefined
          : ["console", "debugger"],
      legalComments: "none",
      format: "esm",
    },
  },

  nitro: {
    preset: "static",
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-icon",
    "nuxt-vuefire",
    "@vueuse/nuxt",
    "@vite-pwa/nuxt",
    "@nuxtjs/i18n",
  ],
  vuefire: {
    config: {
      apiKey: "AIzaSyAlFp1mxhtzaCy16eXFKX9glqWDAiyS_hg",
      authDomain: "jcs-tab-tracker.firebaseapp.com",
      projectId: "jcs-tab-tracker",
      storageBucket: "jcs-tab-tracker.appspot.com",
      messagingSenderId: "557593235569",
      appId: "1:557593235569:web:f48c54248eae89d86f4bd0",
      measurementId: "G-KXRF1B2ZEJ",
    },
    auth: true,
    appCheck: {
      debug: "0d002197-9bcc-42e1-a3d9-06c412bb7a81",
      isTokenAutoRefreshEnabled: true,
      provider: "ReCaptchaV3",
      key: "6LfgHEEgAAAAAEaYmNJkZHGvxQ4-c6syHPdOb5r5",
    },
    emulators: {
      enabled: false,
    },
  },
  pwa: {
    registerType: "autoUpdate",
    injectRegister: "inline",
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
    client: {
      periodicSyncForUpdates: 1000 * 60 * 60 * 24,
    },
    workbox: {
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      globPatterns: ["**/*.{js,css}"],
    },
  },
});
