import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "firebaseui/dist/firebaseui.css";
import { loadFonts } from "./plugins/webfontloader";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

loadFonts();

createApp(App).use(router).use(vuetify).mount("#app");
