import { auth } from "@/firebase";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../views/RedirectScreen.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/LoginScreen.vue"),
    },
    {
      path: "/user",
      name: "User",
      component: () => import("../views/UserScreen.vue"),
    },
    {
      path: "/admin",
      name: "Admin",
      component: () => import("../views/AdminScreen.vue"),
    },
  ],
});

router.beforeResolve(async (to) => {
  const admin = await auth.currentUser
    ?.getIdTokenResult()
    .then((idTokenResult) => {
      return idTokenResult.claims.admin;
    });

  if (to.name !== "Login" && !auth.currentUser) {
    return { name: "Login" };
  }

  if (to.name === "Admin" && !admin) {
    return { name: "User" };
  }
});

export default router;
