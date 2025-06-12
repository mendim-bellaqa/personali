<!-- C:\laragon\www\personali\src\views\C14View.vue -->
<template>
  <div class="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-4 text-white select-none">
    
    <!-- Animated Grid Background -->
    <div class="absolute inset-0 z-0 bg-grid-pattern animate-gridMove"></div>

    <!-- Main Liquid Glass Container -->
    <div
      class="relative z-10 flex flex-col w-full max-w-md rounded-2xl border border-white/20 border-t-white/30 bg-gradient-to-b from-white/15 to-white/5 p-8 shadow-2xl backdrop-blur-xl"
    >
      <!-- Header -->
      <header class="text-center mb-8 flex-shrink-0">
        <h1 class="text-4xl font-bold text-white">C# 14</h1>
        <p class="mt-2 text-gray-300">Select your numbers.</p>
      </header>

      <!-- Grid of 14 Polished 3D Buttons -->
      <div class="grid grid-cols-4 gap-4 place-items-center flex-grow">
        <button 
          v-for="n in 14"
          :key="n"
          @click="selectNumber(n)"
          class="relative flex items-center justify-center w-16 h-16 rounded-full font-bold text-xl shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
          :class="getButtonClasses(n)"
        >
          {{ n }}
        </button>
      </div>

      <!-- Footer Controls -->
      <div class="w-full flex justify-between items-center mt-8 pt-6 border-t border-white/10 flex-shrink-0">
        <button
          @click="resetSelection"
          class="px-4 py-2 rounded-lg border border-red-900/50 border-t-red-400/50 bg-gradient-to-b from-red-600 to-red-700 font-semibold text-white shadow-md transform transition hover:from-red-700 hover:to-red-800 active:scale-95 focus:outline-none text-sm"
        >
          Reset Selection
        </button>
        <router-link to="/" class="text-sm text-blue-400 transition hover:text-blue-300">
          ← Go Back to Collection
        </router-link>
      </div>
    </div>

    <!-- Success Animation Overlay -->
    <transition name="celebrate-fade">
      <div v-if="allNumbersSelected && !hasDismissedSuccess" class="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
        <div class="relative text-center rounded-2xl border border-white/20 border-t-white/30 bg-gradient-to-b from-white/15 to-white/5 p-10 shadow-2xl backdrop-blur-xl">
          <button @click="dismissSuccessMessage" class="absolute top-0 right-0 p-3 text-gray-500 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="text-7xl mb-4">🎉</div>
          <h2 class="text-4xl font-bold text-white">You did it!</h2>
          <p class="text-gray-300 mt-2">All numbers selected.</p>
        </div>
      </div>
    </transition>

  </div>
</template>

<!-- ============================================= -->
<!-- ========= UPDATED SCRIPT SECTION ============ -->
<!-- ============================================= -->
<script>
export default {
  name: 'C14View',
  data() {
    return {
      // This will be immediately overwritten by our saved data if it exists
      selectedNumbers: [],
      hasDismissedSuccess: false, 
    };
  },
  // --- NEW --- Watch for changes to automatically save to localStorage
  watch: {
    selectedNumbers: {
      // This handler function will run whenever selectedNumbers changes
      handler(newNumbers) {
        localStorage.setItem('c14SelectedNumbers', JSON.stringify(newNumbers));
      },
      // deep: true is important for watching changes inside an array
      deep: true,
    }
  },
  computed: {
    allNumbersSelected() {
      return this.selectedNumbers.length === 14;
    }
  },
  methods: {
    selectNumber(n) {
      const index = this.selectedNumbers.indexOf(n);
      if (index === -1) {
        this.selectedNumbers.push(n);
      } else {
        this.selectedNumbers.splice(index, 1);
      }
    },
    resetSelection() {
      this.selectedNumbers = [];
      this.hasDismissedSuccess = false;
      // The 'watch' will automatically save the new empty array
    },
    dismissSuccessMessage() {
      this.hasDismissedSuccess = true;
    },
    getButtonClasses(n) {
      if (this.selectedNumbers.includes(n)) {
        return 'bg-gradient-to-b from-green-500 to-green-600 text-white shadow-green-500/20 border border-green-700/50 shadow-inner shadow-black/30';
      } else {
        return 'bg-gradient-to-b from-zinc-700 to-zinc-800 text-gray-300 border border-zinc-900/50 border-t-zinc-600/50 shadow-inner';
      }
    }
  },
  // --- NEW --- Lifecycle hook to load data when the component is created
  created() {
    // Get the saved string from localStorage
    const savedNumbers = localStorage.getItem('c14SelectedNumbers');

    // If there's saved data, parse it from a string back into an array
    if (savedNumbers) {
      this.selectedNumbers = JSON.parse(savedNumbers);
    }
  }
};
</script>

<style scoped>
/* No changes needed in styles */
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
@keyframes celebrate-pop {
  0% { transform: scale(0.7); opacity: 0; }
  80% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.celebrate-fade-enter-active {
  animation: celebrate-pop 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.celebrate-fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.celebrate-fade-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>