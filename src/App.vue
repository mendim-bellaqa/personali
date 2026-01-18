<template>
  <div id="app" class="min-h-screen font-sans antialiased selection:bg-cyan-500/30" @mousemove="handleMouseMove">
    <!-- GLOBAL PARALLAX BACKGROUND -->
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050510]">
       <div class="parallax-layer stars" :style="parallaxStyle(0.02)"></div>
       <div class="parallax-layer grid-horizon"></div>
       <div class="parallax-layer nebula-glow" :style="parallaxStyle(0.05)"></div>
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
import { auth, db } from './services/firebase';
import { addDoc, collection } from 'firebase/firestore';
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
  },
  methods: {
    handleMouseMove(e) {
      // Calculate normalized mouse position (-1 to 1) for global usage
      this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    },
    parallaxStyle(depth) {
      if (window.innerWidth < 768) return {}; // Disable heavy parallax moving on mobile
      const x = this.mouseX * depth * 30; 
      const y = this.mouseY * depth * 30;
      return {
        transform: `translate(${x}px, ${y}px)`
      };
    },
    onLogin(user) {
      this.user = user;
    },
    async logout() {
      // ... existing logout logic if needed
    }
  }
}
</script>

<style>
/* Global Resets & Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');

body {
  margin: 0;
  background-color: #050510;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
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

/* --- CYBER HORIZON BACKGROUND STYLES --- */
.parallax-layer {
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  pointer-events: none;
  transition: transform 0.1s linear;
  will-change: transform;
}

/* STARS */
.stars {
  background-image: 
    radial-gradient(1.5px 1.5px at 20px 30px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 40px 70px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 90px 40px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 160px 120px, #ffffff, rgba(0,0,0,0));
  background-size: 300px 300px;
  opacity: 0.4;
}

/* GRID HORIZON */
.grid-horizon {
  background: 
    linear-gradient(transparent 0%, rgba(0, 243, 255, 0.05) 1%, transparent 2%),
    linear-gradient(90deg, transparent 0%, rgba(0, 243, 255, 0.05) 1%, transparent 2%);
  background-size: 60px 60px;
  transform: perspective(600px) rotateX(60deg) translateY(0) translateZ(-200px);
  transform-origin: center 80%;
  opacity: 0.25;
  bottom: -40%;
  height: 100%;
  width: 100%;
  position: absolute;
  animation: gridMove 15s linear infinite;
  mask-image: linear-gradient(to bottom, transparent, black 40%);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 40%);
}

@keyframes gridMove {
  0% { background-position: 0 0; }
  100% { background-position: 0 600px; }
}

/* NEBULA GLOW */
.nebula-glow {
  background: 
    radial-gradient(circle at 20% 30%, rgba(157, 0, 255, 0.1), transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0, 243, 255, 0.08), transparent 50%);
  filter: blur(60px);
  opacity: 0.8;
}
</style>

{
  "rules": {
    "tasks": {
      ".read": "auth != null",
      ".write": "auth != null && request.auth.uid != null",
      "$taskId": {
        ".read": "auth != null && auth.uid == resource.data.userId",
        ".write": "auth != null && auth.uid == request.resource.data.userId"
      }
    }
  }
}