import type { Router } from "vue-router";
const intervalMS = 60 * 60 * 1000;

export default (router: Router) => {
  router
    .isReady()
    .then(async () => {
      const { registerSW } = await import("virtual:pwa-register");
      registerSW({
        immediate: true,
        onRegistered(r) {
          r &&
            setInterval(() => {
              r.update();
            }, intervalMS);
        },
        onNeedRefresh() {
          window.location.reload();
        },
      });
    })
    .catch(() => {});
};
