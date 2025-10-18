import { createRouter, createWebHistory } from "vue-router"
import { getAuth, onAuthStateChanged } from "firebase/auth"

import LoginForm from '../components/Login.vue'
import SignupForm from '../components/Signup.vue'
import Home from '../components/Home.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/home',
            name: 'Home',
            component: Home,
            meta: { requiresAuth: true } 
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginForm,
            meta: { requiresGuest: true } 
        },
        {
            path: '/signup',
            name: 'Signup',
            component: SignupForm,
            meta: { requiresGuest: true } 
        }
    ],
});

const auth = getAuth()

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  onAuthStateChanged(auth, (user) => {
    if (requiresAuth && !user) {
      // Not logged in → redirect to login
      next('/login')
    } else if (requiresGuest && user) {
      // Already logged in → redirect to home
      next('/home')
    } else {
      next()
    }
  })
})

export default router;