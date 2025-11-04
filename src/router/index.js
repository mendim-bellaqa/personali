import Vue from 'vue'
import VueRouter from 'vue-router'
import TskView from '../views/TskView.vue'
import HomeView from '../views/HomeView.vue'
import PryView from '../views/PryView.vue'
import MedView from '../views/MedView.vue'
import DWNView from '../views/DWNView.vue'  // Good, uncommented and used
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ArchiveView from '../views/ArchiveView.vue'
import { auth } from '../services/firebase';

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/tsk', name: 'Tsk', component: TskView, meta: { requiresAuth: true } },
  { path: '/pry', name: 'PG', component: PryView, meta: { requiresAuth: true } },
  { path: '/med', name: 'SC', component: MedView, meta: { requiresAuth: true } },
  { path: '/dwn', name: 'DWN', component: DWNView, meta: { requiresAuth: true } },
  { path: '/archive', name: 'Archive', component: ArchiveView, meta: { requiresAuth: true } },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  // Check if user is trying to access auth pages while logged in
  if ((to.name === 'Login' || to.name === 'Register') && auth.currentUser) {
    // Special case: Allow registration completion redirect
    if (to.name === 'Register' && to.query.registered === 'true') {
      return next(); // Allow redirect back to register after registration
    }
    
    // Allow login page with query parameters (like registered=true)
    if (to.name === 'Login' && to.query.registered === 'true') {
      return next(); // Allow redirect to login with registration success
    }
    
    // Redirect authenticated users to home or intended redirect
    const redirect = to.query.redirect || '/';
    return next(redirect);
  }

  // Check if route requires authentication
  if (!to.meta.requiresAuth) return next();

  // Check Firebase authentication
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }
    
    return next()
  } catch (err) {
    console.error('Auth check failed:', err);
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }
})

export default router