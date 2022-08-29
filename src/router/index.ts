import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/firebase";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/admin",
      name: "Admin",
      component: () => import("@/views/Admin.vue"),
      beforeEnter: checkAdmin,
    },
    {
      path: "/user",
      name: "User",
      component: () => import("@/views/User.vue"),
      beforeEnter: loginRequired,
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/Login.vue"),
    },
  ],
});

function loginRequired(to: any, from: any, next: any) {
  auth.currentUser ? next() : next("/");
}

async function checkAdmin(to: any, from: any, next: any) {
  if (auth.currentUser) {
    auth.currentUser.getIdTokenResult().then((idTokenResult) => {
      if (idTokenResult.claims.admin) {
        next();
      } else {
        next("/");
      }
    });
  } else {
    next("/");
  }
}

export default router;
