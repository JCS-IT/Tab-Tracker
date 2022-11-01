// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { loadFonts } from "@/plugins/webfontloader";
import { registerSW } from "virtual:pwa-register";

loadFonts();

const intervalMS = 60 * 60 * 1000;

registerSW({
  onRegistered(r) {
    r &&
      setInterval(() => {
        r.update();
      }, intervalMS);
  },
});

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.mount("#app");
