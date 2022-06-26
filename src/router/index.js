import { createRouter, createWebHistory } from "vue-router";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

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
  if (auth.currentUser) {
    next();
  } else {
    next("/");
  }
}

async function checkAdmin(to, from, next) {
  const docRef = doc(db, `staff/${auth?.currentUser?.uid}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.data()?.isAdmin) {
    next();
  } else {
    next("/");
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
