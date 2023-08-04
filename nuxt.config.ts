// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  experimental: {
    typedPages: true,
  },

  app: {
    head: {
      charset: "utf-8",
      title: "JCS Tab Tracker",
      viewport: "width=device-width, initial-scale=1",
      noscript: [
        {
          innerHTML:
            "JCS Tab Tracker requires javascript to function. Please check that your browser supports javascript and that it is enabled",
        },
      ],
    },
  },

  nitro: {
    preset: "static",
  },

  vite: {
    esbuild: {
      drop:
        process.env.NODE_ENV === "development"
          ? undefined
          : ["console", "debugger"],
      legalComments: "none",
      format: "esm",
    },
  },
  // Module config
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-icon",
    "nuxt-vuefire",
    "@vueuse/nuxt",
    "@vite-pwa/nuxt",
    "nuxt-purgecss",
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
      debug: process.env.NODE_ENV !== "production",
      isTokenAutoRefreshEnabled: true,
      provider: "ReCaptchaV3",
      key: "6Le2i50kAAAAAOrfwARWnLBoPuTnm9uZMyg-ALV1",
    },
    emulators: {
      enabled: false,
    },
  },
  pwa: {
    injectRegister: "inline",
    registerType: "autoUpdate",
    includeAssets: [
      "favicon.svg",
      "favicon.ico",
      "robots.txt",
      "apple-touch-icon.png",
    ],
    devOptions: {
      enabled: false,
    },
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
      skipWaiting: true,
      cleanupOutdatedCaches: true,
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
  },
});
