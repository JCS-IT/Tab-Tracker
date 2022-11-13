// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Plugins
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import { loadFonts } from "@/plugins/webfontloader";

loadFonts();

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.mount("#app");
