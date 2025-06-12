<template>
  <div class="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-4 text-white select-none">
    
    <!-- Animated Grid Background (Identical to MedView) -->
    <div class="absolute inset-0 z-0 bg-grid-pattern animate-gridMove"></div>

    <!-- Main Liquid Glass Container (Styled identically to MedView) -->
    <div
      class="relative z-10 flex flex-col items-center justify-between w-full max-w-md rounded-2xl border border-white/20 border-t-white/30 bg-gradient-to-b from-white/15 to-white/5 p-10 shadow-2xl backdrop-blur-xl"
    >
      <!-- Header (Styled identically to MedView) -->
      <header class="text-center">
        <h1 class="text-4xl font-bold text-white">PRY</h1>
        <p class="mt-2 text-gray-300">Tap the counter to begin.</p>
      </header>

      <!-- Main 3D Counter Button (Unique element, placed within the consistent layout) -->
      <div class="relative flex flex-col items-center my-8">
        <button
          @click="incrementCount"
          :disabled="count >= MAX_COUNT"
          class="relative z-10 w-48 h-48 md:w-56 md:h-56 rounded-full shadow-lg transform transition-all duration-150 ease-in-out focus:outline-none glowing-border"
          :class="{
            'active:translate-y-1': count < MAX_COUNT,
            'hover:scale-105': count < MAX_COUNT,
            'cursor-not-allowed opacity-70': count >= MAX_COUNT,
            'animate-pulse': showPulse && count >= MAX_COUNT
          }"
        >
          <div class="relative h-full w-full rounded-full overflow-hidden flex items-center justify-center">
            <img
              :src="require('@/assets/card.jpeg')"
              class="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-soft-light"
              alt="Button background texture"
            />
            <span class="font-bold text-5xl md:text-7xl text-white text-shadow">
              {{ count }}
            </span>
          </div>
        </button>

        <!-- Message area below the button -->
        <div class="mt-8 text-xl text-center h-8">
          <div
            v-if="count >= MAX_COUNT"
            class="font-semibold text-yellow-300"
            :class="{ 'animate-bounce': showPulse }"
          >
            {{ celebrationMessage }}
          </div>
          <div
            v-else-if="message"
            class="text-lg text-gray-400"
          >
            {{ message }}
          </div>
        </div>
      </div>

      <!-- Bottom area for other buttons -->
      <div class="w-full flex justify-between items-center">
        <!-- Reset Button (Styled identically to MedView's buttons) -->
        <button
          @click="resetCount"
          class="px-6 py-2 rounded-lg border border-red-900/50 border-t-red-400/50 bg-gradient-to-b from-red-600 to-red-700 font-semibold text-white shadow-md transform transition-all duration-150 hover:from-red-700 hover:to-red-800 active:scale-95 focus:outline-none"
        >
          Reset (0)
        </button>
        <!-- Go Back Link (Styled identically to MedView's link) -->
        <router-link to="/" class="text-sm text-blue-400 transition hover:text-blue-300">
          ← Go Back to Collection
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// The script remains the same as it handles logic, not styling.
export default {
  name: 'PryView',
  data() {
    return {
      MAX_COUNT: 100,
      count: 0,
      message: '',
      celebrationMessage: `🎉 You reached 100! 🎉`,
      showPulse: false,
      messageTimeout: null,
    };
  },
  methods: {
    incrementCount() {
      if (this.count < this.MAX_COUNT) {
        this.count++;
        this.message = '';
      }
      if (this.count === this.MAX_COUNT) {
        this.handleMaxCountReached();
      }
    },
    resetCount() {
      this.count = 0;
      this.message = 'Counter Reset!';
      this.showPulse = false;
      this.clearMessageAfterDelay();
    },
    handleMaxCountReached() {
      this.celebrationMessage = `🎉 You hit ${this.MAX_COUNT}! Great job! 🎉`;
      this.showPulse = true;
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      setTimeout(() => {
        this.showPulse = false;
      }, 3000);
    },
    clearMessageAfterDelay() {
      if (this.messageTimeout) {
        clearTimeout(this.messageTimeout);
      }
      this.messageTimeout = setTimeout(() => {
        this.message = '';
      }, 2000);
    }
  },
  watch: {
    count(newVal) {
      if (newVal < this.MAX_COUNT) {
        this.showPulse = false;
      }
    }
  }
};
</script>

<style scoped>
/* These styles are all identical to the previous versions and are correct. */

/* Grid pattern and animation styles */
.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 2px, transparent 2px);
  background-size: 60px 60px;
}

@keyframes gridMove {
  0% { background-position: 0 0; }
  100% { background-position: 60px 60px; }
}

.animate-gridMove {
  animation: gridMove 30s linear infinite;
}

/* Glowing border effect for the main button */
.glowing-border {
  position: relative;
  overflow: hidden; 
}
.glowing-border::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%;
  height: 150%;
  background: conic-gradient(from 0deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.3));
  animation: rotate-glow 5s linear infinite;
  opacity: 0.3; 
  transition: opacity 0.3s ease-in-out;
}
.glowing-border::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 9999px; /* This makes it a circle */
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}
.glowing-border:hover::before, .glowing-border:active::before {
  opacity: 0.8;
}
.glowing-border:hover::after, .glowing-border:active::after {
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.6);
}
@keyframes rotate-glow {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* 3D text effect */
.text-shadow {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7), 
               0 0 10px rgba(0, 0, 0, 0.5);
}
</style>