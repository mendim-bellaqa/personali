<template>
  <div id="app" class="min-h-screen font-sans antialiased selection:bg-cyan-500/30">
    <!-- GLOBAL BACKGROUND -->
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
       <img src="@/assets/background.jpeg" class="w-full h-full object-cover opacity-60" alt="background" />
       <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
    </div>

    <!-- Main Content -->
    <main class="relative z-10 pb-20 md:pb-0">
      <transition name="fade" mode="out-in">
        <router-view @login="onLogin" :mouseX="mouseX" :mouseY="mouseY" />
      </transition>
    </main>

    <!-- Mobile Bottom Navigation -->
    <BottomNav class="md:hidden" />
  </div>
</template>

<script>
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import BottomNav from './components/BottomNav.vue';

export default {
  name: 'AppRoot',
  components: { BottomNav },
  data() {
    return {
      user: null,
      mouseX: 0,
      mouseY: 0
    }
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      this.user = user;
      if (user && (this.$route.name === 'Login' || this.$route.name === 'Register')) {
        const redirect = this.$route.query.redirect || '/';
        this.$router.replace(redirect);
      }
    });
    window.addEventListener('mousemove', this.handleMouseMove);
  },
  beforeUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
  },
  methods: {
    handleMouseMove(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    },
    onLogin(user) {
      this.user = user;
    }
  }
}
</script>

<style>
/* Global Resets & Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;600;800&display=swap');

body {
  margin: 0;
  background-color: #050510;
  font-family: 'Outfit', sans-serif;
  overflow-x: hidden;
  color: #fff;
}

/* Global Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>