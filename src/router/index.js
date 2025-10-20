import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Import all your views
import AdminDash from "../views/admin/admindash.vue";
import Login from "../views/auth/Login.vue";
import Signup from "../views/auth/Signup.vue";
import UserHome from "../views/user/index.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ✅ Admin Dashboard (protected)
    {
      path: "/admin",
      name: "AdminDash",
      component: AdminDash,
      meta: { requiresAuth: true },
    },

    // ✅ User Dashboard (protected)
    {
      path: "/user",
      name: "UserHome",
      component: UserHome,
      meta: { requiresAuth: true },
    },

    // ✅ Login & Signup (for guests only)
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: { requiresGuest: true },
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup,
      meta: { requiresGuest: true },
    },
  ],
});

// ✅ Firebase Auth Guard
const auth = getAuth();

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);

  onAuthStateChanged(auth, (user) => {
    if (requiresAuth && !user) {
      next("/signup"); // not logged in → login page
    } else if (requiresGuest && user) {
      next("/user"); // already logged in → user dashboard
    } else {
      next(); // continue as normal
    }
  });
});

export default router;
