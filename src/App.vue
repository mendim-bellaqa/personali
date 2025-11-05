<!-- src/App.vue -->
<template>
  <div id="app" class="min-h-screen bg-black text-white">
    <!-- Animated Grid Background -->
    <div class="fixed inset-0 z-0 opacity-20">
      <div class="bg-grid-pattern animate-gridMove"></div>
    </div>

    <!-- Main Content with proper top padding for UniversalBanner -->
    <main class="relative z-10 pt-16">
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

/* Adjust spacing for header and title */
#app main {
  padding-top: 16px; /* Reduce top padding */
}
</style>