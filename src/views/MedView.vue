<template>
  <div class="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-5">
    <UniversalBanner />
    <!-- Grid Animated Background -->
    <div class="absolute inset-0 z-0 bg-grid-pattern animate-gridMove"></div>

    <!-- Main Content Container: Enhanced Liquid Glass Effect -->
    <div
      class="relative z-10 w-full max-w-md rounded-2xl border border-white/20 border-t-white/30 bg-gradient-to-b from-white/15 to-white/5 p-10 shadow-2xl backdrop-blur-xl"
    >
      <div class="flex flex-col items-center">
        <!-- Header -->
        <div class="mb-8 flex items-center justify-center gap-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.871 4.23c2.395-1.79 5.45-2.227 8.29-1.197 2.253.818 4.053 2.618 4.87 4.871 1.03 2.84-.407 5.9-2.197 8.295a14.532 14.532 0 01-2.27 2.466c-1.07.96-2.438 1.54-3.87 1.54s-2.8-.58-3.87-1.54A14.535 14.535 0 014.13 16.2c-1.79-2.395-3.227-5.455-2.197-8.295.817-2.252 2.617-4.052 4.87-4.87z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 14.25c-1.353 0-2.684-.284-3.92-.83a15.048 15.048 0 01-3.921-2.583M12 14.25v2.584c0 1.354.283 2.684.83 3.92a15.048 15.048 0 002.583 3.921" />
          </svg>
          <h1 class="text-4xl font-bold text-white"></h1>
        </div>

        <!-- Timer Display -->
        <div class="mb-10 w-full rounded-xl border border-white/10 bg-black/30 py-4 px-6 text-center text-6xl font-mono text-white shadow-inner shadow-black/20">
          {{ formattedTime }}
        </div>

        <!-- Control Buttons -->
        <div class="mb-10 flex space-x-4">
          <button @click="startTimer" class="flex w-28 items-center justify-center gap-x-2 rounded-lg py-2 font-semibold text-white transition liquid-glass-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
            Start
          </button>
          <button @click="stopTimer" class="flex w-28 items-center justify-center gap-x-2 rounded-lg py-2 font-semibold text-white transition liquid-glass-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5"><path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" /></svg>
            Stop
          </button>
          <button @click="resetTimer" class="flex w-28 items-center justify-center gap-x-2 rounded-lg py-2 font-semibold text-white transition liquid-glass-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5"><path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201-4.42 5.5 5.5 0 017.153-7.923A5.5 5.5 0 0117.5 8.5h-3.5a2 2 0 00-2 2v2.5a.5.5 0 01-1 0V13a.5.5 0 01.5-.5h5.5a.5.5 0 01.447.724l-1.135 2.27a.5.5 0 01-.894-.448l.22-.44a4.503 4.503 0 00-2.35-2.652zM2.5 11.5a5.5 5.5 0 019.201 4.42 5.5 5.5 0 01-7.153 7.923A5.5 5.5 0 012.5 11.5h3.5a2 2 0 002-2V7a.5.5 0 011 0v2.5a.5.5 0 01-.5.5H3a.5.5 0 01-.447-.724l1.135-2.27a.5.5 0 01.894.448l-.22.441a4.503 4.503 0 002.35 2.652z" clip-rule="evenodd" /></svg>
            Reset
          </button>
        </div>

        <!-- Quote -->
        <p class="mb-8 text-center italic text-gray-300">HLO</p>

        <!-- FIXED Navigation Link -->
        <router-link to="/" class="text-sm text-blue-400 transition hover:text-blue-300">
          ← Go Back to Collection
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import UniversalBanner from '@/components/UniversalBanner.vue';

export default {
  name: "MedView",
  components: { UniversalBanner },
  data() {
    return {
      totalSeconds: 12 * 60,
      interval: null,
      hasVibrated: false,
    };
  },
  computed: {
    formattedTime() {
      const minutes = String(Math.floor(this.totalSeconds / 60)).padStart(2, "0");
      const seconds = String(this.totalSeconds % 60).padStart(2, "0");
      return `${minutes}:${seconds}`;
    },
  },
  methods: {
    startTimer() {
      if (this.interval) return;
      this.interval = setInterval(() => {
        if (this.totalSeconds > 0) {
          this.totalSeconds--;
          if (this.totalSeconds === 2 * 60 && !this.hasVibrated) {
            this.triggerVibration();
            this.hasVibrated = true;
          }
        } else {
          this.stopTimer();
        }
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.interval);
      this.interval = null;
    },
    resetTimer() {
      this.stopTimer();
      this.totalSeconds = 12 * 60;
      this.hasVibrated = false;
    },
    triggerVibration() {
      if ("vibrate" in navigator) {
        navigator.vibrate([300, 200, 300]);
      }
    },
  },
  beforeUnmount() { // Changed to beforeUnmount for Vue 3 best practice
    clearInterval(this.interval);
  },
};
</script>

<style scoped>
/* Thicker, more visible grid pattern and animation */
.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 2px, transparent 2px);
  background-size: 60px 60px; /* Increased size for a less dense look */
}

@keyframes gridMove {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 60px 60px;
  }
}

.animate-gridMove {
  animation: gridMove 30s linear infinite;
}
</style>