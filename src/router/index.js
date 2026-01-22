import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../services/firebase'

// Import all views
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import TskView from '../views/TskView.vue'
import ProjectView from '../views/ProjectView.vue'
import ProfileView from '../views/ProfileView.vue'
import SettingsView from '../views/SettingsView.vue'
import MedView from '../views/MedView.vue'
import DWNView from '../views/DWNView.vue'
import ArchiveView from '../views/ArchiveView.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/tsk', name: 'Tasks', component: TskView, meta: { requiresAuth: true } },
  { path: '/project', name: 'Projects', component: ProjectView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'Profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/settings', name: 'Settings', component: SettingsView, meta: { requiresAuth: true } },
  { path: '/med', name: 'Focus', component: MedView, meta: { requiresAuth: true } },
  { path: '/dwn', name: 'Calendar', component: DWNView, meta: { requiresAuth: true } },
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
  if ((to.name === 'Login' || to.name === 'Register')) {
    const user = auth.currentUser;
    if (user) {
      // Special case: Allow registration completion redirect
      if (to.name === 'Register' && to.query.registered === 'true') {
        return next();
      }

      // Allow login page with query parameters
      if (to.name === 'Login' && to.query.registered === 'true') {
        return next();
      }

      // Redirect authenticated users to home or intended redirect
      const redirect = to.query.redirect || '/';
      return next(redirect);
    }
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