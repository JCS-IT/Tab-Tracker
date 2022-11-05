import { createRouter, createWebHistory } from "vue-router/auto";
import { auth } from "utils/firebase";

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(import.meta.env.BASE_URL),
});

router.beforeEach((to) => {
  const { currentUser } = auth;
  if (!currentUser && to.name !== "Login") {
    return { name: "Login" };
  }
});

export default router;
