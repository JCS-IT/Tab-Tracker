import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { registerSW } from "virtual:pwa-register";

const intervalMS = 60 * 60 * 1000;

registerSW({
  immediate: true,
  onRegistered(r) {
    r &&
      setInterval(() => {
        r.update();
      }, intervalMS);
  },
});
loadFonts();

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.mount("#app");
