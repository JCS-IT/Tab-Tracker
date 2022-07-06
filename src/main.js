import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import "firebaseui/dist/firebaseui.css";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    window.location.reload();
  },
  onOfflineReady() {
    console.log("SW: Offline ready");
  },
});

loadFonts();

createApp(App).use(router).use(vuetify).mount("#app");
