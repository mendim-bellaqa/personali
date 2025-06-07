<!-- src/views/PryView.vue -->
<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white select-none">
    
    <!-- Header -->
    <header class="text-center absolute top-0 mt-10">
      <h1 class="text-6xl font-serif">PRY</h1>
      <p class="mt-2 text-gray-400">Tap the counter to begin.</p>
    </header>

    <!-- Main 3D Counter Button, styled to match your app -->
    <div class="relative flex flex-col items-center">
      <!-- The main button -->
      <button
        @click="incrementCount"
        :disabled="count >= MAX_COUNT"
        class="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full shadow-lg transform transition-all duration-150 ease-in-out focus:outline-none glowing-border"
        :class="{
          'active:translate-y-1': count < MAX_COUNT,
          'hover:scale-105': count < MAX_COUNT,
          'cursor-not-allowed opacity-70': count >= MAX_COUNT,
          'animate-pulse': showPulse && count >= MAX_COUNT
        }"
      >
        <div class="relative h-full w-full rounded-full overflow-hidden flex items-center justify-center">
          <!-- The local texture from your assets -->
          <img
            :src="require('@/assets/card.jpeg')"
            class="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-soft-light"
            alt="Button background texture"
          />
          <!-- The number itself, with 3D text effect -->
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
    <div class="w-full max-w-md absolute bottom-0 mb-12 flex justify-between items-center px-4">
      <button
        @click="resetCount"
        class="px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg shadow-md transform transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
      >
        Reset (0)
      </button>
      <router-link to="/" class="px-6 py-3 text-gray-300 hover:text-white font-semibold rounded-lg transition-colors">
        Go Back
      </router-link>
    </div>
  </div>
</template>

<script>
//
// THIS SCRIPT IS THE VUE 2 TRANSLATION OF THE VUE 3 CODE
//
export default {
  name: 'PryView',
  data() {
    return {
      MAX_COUNT: 100,
      count: 0,
      message: '',
      celebrationMessage: `🎉 You reached 100! 🎉`,
      showPulse: false,
      messageTimeout: null, // To manage the message clearing timer
    };
  },
  methods: {
    incrementCount() {
      if (this.count < this.MAX_COUNT) {
        this.count++;
        this.message = ''; // Clear any previous message
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

      // Vibration API
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      
      // Stop pulsing after 3 seconds
      setTimeout(() => {
        this.showPulse = false;
      }, 3000);
    },
    clearMessageAfterDelay() {
      // Clear any existing timer before starting a new one
      if (this.messageTimeout) {
        clearTimeout(this.messageTimeout);
      }
      this.messageTimeout = setTimeout(() => {
        this.message.value = '';
      }, 2000);
    }
  },
  watch: {
    // Watch for count changes
    count(newVal) {
      console.log(`Count is now: ${newVal}`);
      if (newVal < this.MAX_COUNT) {
        this.showPulse = false; // Ensure pulse stops if count goes below max
      }
    }
  }
};
</script>

<style scoped>
/* 
  We can reuse the global styles from your other files, 
  but we'll scope some here for this component specifically.
*/

/* Reusing the glowing border effect from your main page */
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

/* Reusing the 3D text effect */
.text-shadow {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7), 
               0 0 10px rgba(0, 0, 0, 0.5);
}
</style>