import { auth } from "@/firebase";
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
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/admin",
      name: "Admin",
      component: () => import("../views/Admin.vue"),
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const user = await auth.currentUser;
  const admin = (await auth.currentUser?.getIdTokenResult())?.claims.admin;

  if (requiresAuth && !user) {
    next("/login");
  }
  if (requiresAdmin && !admin) {
    next("/user");
  }
  next();
});

export default router;
