import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("../pages/LoginView.vue"),
    },
    {
      path: "/user",
      name: "User",
      component: () => import("../pages/UserView.vue"),
    },
  ],
});

export default router;
