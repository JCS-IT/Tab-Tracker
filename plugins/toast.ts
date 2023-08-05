import Toast, { POSITION, type PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

const options: PluginOptions = {
  timeout: 3000,
  position: POSITION.BOTTOM_LEFT,
  closeOnClick: true,
  draggable: true,
  pauseOnFocusLoss: true,
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, options);
});
