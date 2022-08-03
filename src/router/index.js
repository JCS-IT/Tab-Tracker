import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../firebase";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@views/Home.vue"),
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("@views/Admin.vue"),
    beforeEnter: loginRequired && checkAdmin,
  },
  {
    path: "/:from?/user/:id",
    name: "User",
    component: () => import("@views/User.vue"),
    beforeEnter: loginRequired,
  },
];

function loginRequired(to, from, next) {
  auth.currentUser ? next() : next("/");
}

async function checkAdmin(to, from, next) {
  if (auth.currentUser) {
    if (auth.currentUser.admin) {
      next();
    } else {
      next("/");
    }
  } else {
    next("/");
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
