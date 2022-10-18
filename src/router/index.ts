import { createRouter, createWebHistory } from "vue-router";
import { auth } from "utils/firebase";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Index",
      component: () => import("../pages/IndexPage.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../pages/LoginPage.vue"),
    },
    {
      path: "/user",
      name: "User",
      component: () => import("../pages/UserPage.vue"),
    },
  ],
});

router.beforeResolve((to, from) => {
  if (to.name != "Login" && !auth.currentUser) {
    return { name: "Login" };
  }
});

export default router;
