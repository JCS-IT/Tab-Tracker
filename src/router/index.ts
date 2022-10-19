import { createRouter, createWebHistory } from "vue-router";
import { auth } from "utils/firebase";

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes: [
    {
      path: "/",
      name: "Index",
      component: () => import("@/pages/IndexPage.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/pages/LoginPage.vue"),
    },
    {
      path: "/user",
      name: "User",
      component: () => import("@/pages/UserPage.vue"),
    },
    {
      path: "/admin",
      name: "Admin",
      component: () => import("@/pages/AdminPage.vue"),
      children: [
        {
          path: "staff",
          component: () => import("@/pages/admin/StaffPage.vue"),
        },
        {
          path: "items",
          component: () => import("@/pages/admin/ItemsPage.vue"),
        },
      ],
    },
  ],

  history: createWebHistory(import.meta.env.BASE_URL),
});

router.beforeEach((to, from) => {
  if (to.name != "Login" && !auth.currentUser) {
    return { name: "Login" };
  }
});

export default router;
