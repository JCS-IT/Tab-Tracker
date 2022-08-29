import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/user",
      name: "User",
      component: () => import("../views/User.vue"),
    },
    {
      path: "/admin",
      name: "Admin",
      component: () => import("../views/Admin.vue"),
    },
  ],
});

export default router;
