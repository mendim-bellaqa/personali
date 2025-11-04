<!-- src/App.vue -->
<template>
  <div id="app" class="min-h-screen bg-black text-white">
    <!-- Animated Grid Background -->
    <div class="fixed inset-0 z-0 opacity-20">
      <div class="bg-grid-pattern animate-gridMove"></div>
    </div>

    <!-- Header with Liquid Glass Effect -->
    <header class="relative z-10 w-full border-b border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl">
      <div class="container mx-auto px-6 py-4 flex items-center justify-between">
        
        <!-- Logo Section -->
        <div class="flex items-center gap-6">
          <router-link to="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center">
              <span class="text-lg font-bold">P</span>
            </div>
            <span class="text-xl font-serif font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">PASS</span>
          </router-link>
          
          <!-- Navigation -->
          <nav class="hidden lg:flex gap-8">
            <router-link to="/tsk" class="nav-link-underline">TSK</router-link>
            <router-link v-if="user" to="/archive" class="nav-link-underline">Archive</router-link>
            <router-link to="/pry" class="nav-link-underline">PRY</router-link>
            <router-link to="/med" class="nav-link-underline">MED</router-link>
            <router-link to="/dwn" class="nav-link-underline">DWN</router-link>
          </nav>
        </div>

        <!-- User Section -->
        <div class="flex items-center gap-4">
          <div v-if="user" class="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span class="text-xs font-bold">{{ (user?.displayName || user?.email || 'U')[0].toUpperCase() }}</span>
            </div>
            <span class="text-sm text-gray-200 hidden sm:block">{{ user?.displayName || user?.email || 'User' }}</span>
          </div>
          
          <div class="flex items-center gap-2">
            <router-link v-if="!user" :to="{ name: 'Login' }" class="nav-btn liquid-glass">Sign in</router-link>
            <router-link v-if="!user" :to="{ name: 'Login', query: { mode: 'register' } }" class="nav-btn liquid-glass-primary">Register</router-link>
            <button v-if="user" @click="logout" class="nav-btn liquid-glass-danger">Sign out</button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative z-10">
      <router-view @login="onLogin" />
    </main>
  </div>
</template>

<script>
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';

export default {
  name: 'AppRoot',
  data() {
    return {
      user: null
    }
  },
  created() {
    // Initialize Firebase auth state listener
    onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? `User logged in: ${user.uid}` : 'No user');
      this.user = user;
      
      // If user is authenticated but we're on a public page, redirect appropriately
      if (user && (this.$route.name === 'Login' || this.$route.name === 'Register')) {
        const redirect = this.$route.query.redirect || '/';
        this.$router.replace(redirect);
      }
    });
  },
  methods: {
    onLogin(user) {
      this.user = user;
    },
    async logout() {
      try {
        await auth.signOut();
        this.user = null;
        // Redirect to login if user signs out while on protected route
        const protectedRoutes = ['Tsk', 'PG', 'SC', 'DWN']
        if (protectedRoutes.includes(this.$route.name)) {
          this.$router.replace({ name: 'Login', query: { redirect: this.$route.fullPath } })
        }
      } catch (e) {
        console.warn('Sign out failed:', e);
      }
    }
  }
}
</script>

<style scoped>
/* Grid Pattern Background */
.bg-grid-pattern {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 60px 60px;
}

@keyframes gridMove {
  0% { background-position: 0 0; }
  100% { background-position: 60px 60px; }
}

.animate-gridMove {
  animation: gridMove 60s linear infinite;
}

/* Underline Navigation Links */
.nav-link-underline {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.75rem 0;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link-underline::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 2px;
}

.nav-link-underline::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #8b5cf6, #3b82f6);
  transform: translateX(-50%);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link-underline:hover {
  color: white;
  transform: translateY(-1px);
}

.nav-link-underline:hover::after {
  width: 100%;
}

.nav-link-underline:hover::before {
  width: 50%;
}

.nav-link-underline.router-link-active {
  color: white;
  font-weight: 600;
}

.nav-link-underline.router-link-active::after {
  width: 100%;
}

.nav-link-underline.router-link-active::before {
  width: 30%;
}

/* Liquid Glass Buttons */
.liquid-glass {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  color: white;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  font-size: 0.875rem;
  font-weight: 500;
}

.liquid-glass::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.liquid-glass:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.liquid-glass:hover::before {
  left: 100%;
}

.liquid-glass-primary {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.liquid-glass-primary:hover {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.5);
}

.liquid-glass-danger {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
}

.liquid-glass-danger:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.5);
}

.nav-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  color: white;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  font-size: 0.875rem;
  font-weight: 500;
}

.nav-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.nav-btn:hover::before {
  left: 100%;
}

/* Mobile Optimizations */
@media (max-width: 1024px) {
  nav {
    display: none;
  }
  
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 640px) {
  header .container {
    padding: 0.75rem 1rem;
  }
  
  .nav-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }
  
  .user-info span {
    display: none;
  }
}
</style>