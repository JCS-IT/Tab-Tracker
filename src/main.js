import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import "firebaseui/dist/firebaseui.css";
import { registerSW } from "virtual:pwa-register";
import { createPinia } from "pinia";

const updateSW = registerSW({
  onNeedRefresh() {
    window.location.reload();
  },
  onOfflineReady() {
    console.log("SW: Offline ready");
  },
});

loadFonts();

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.use(createPinia())
app.mount("#app");
