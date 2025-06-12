<!-- C:\laragon\www\personali\src\views\DWNView.vue -->
<template>
  <div class="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-4 text-white">
    
    <!-- Animated Grid Background -->
    <div class="absolute inset-0 z-0 bg-grid-pattern animate-gridMove"></div>

    <!-- Main Liquid Glass Container -->
    <div class="relative z-10 flex flex-col w-full max-w-lg rounded-2xl border border-white/20 border-t-white/30 bg-gradient-to-b from-white/15 to-white/5 p-8 shadow-2xl backdrop-blur-xl">
      
      <!-- Header -->
      <header class="mb-6 text-center select-none">
        <h1 class="text-4xl font-bold mb-1">{{ monthName }} {{ year }}</h1>
        <p class="text-gray-300">Tap a date to select or deselect.</p>
      </header>

      <!-- Calendar Grid -->
      <div class="w-full grid grid-cols-7 gap-2 select-none">
        <!-- Weekday Headers -->
        <div v-for="day in weekdays" :key="day" class="text-center font-semibold text-gray-400 text-sm h-10 flex items-center justify-center">
          {{ day }}
        </div>

        <!-- Blank spaces for days before month starts -->
        <div v-for="blank in firstDayOfWeek" :key="'blank-' + blank"></div>

        <!-- Days of the month -->
        <div
          v-for="day in daysInMonth"
          :key="day"
          @click="toggleSelect(day)"
          class="day-cell cursor-pointer rounded-full h-12 w-12 flex items-center justify-center font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
          :class="getDayClasses(day)"
        >
          {{ day }}
        </div>
      </div>
      
      <!-- Footer Controls -->
      <div class="w-full flex justify-between items-center mt-6 pt-6 border-t border-white/10">
        <button @click="resetSelection" class="px-4 py-2 rounded-lg border border-red-900/50 border-t-red-400/50 bg-gradient-to-b from-red-600 to-red-700 font-semibold text-white shadow-md transform transition hover:from-red-700 hover:to-red-800 active:scale-95 focus:outline-none text-sm">
          Reset Selections
        </button>
        <router-link to="/" class="text-sm text-blue-400 transition hover:text-blue-300">
          ← Go Back to Collection
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DWNView',
  data() {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth(), // 0-based
      selectedDays: new Set(),
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    };
  },
  watch: {
    // Watch for changes to automatically save to localStorage
    selectedDays: {
      handler(newDaySet) {
        // Convert Set to Array before saving, as JSON can't handle Sets
        const arrayToSave = Array.from(newDaySet);
        localStorage.setItem('dwnSelectedDays', JSON.stringify(arrayToSave));
      },
      deep: true,
    }
  },
  computed: {
    daysInMonth() {
      return new Date(this.year, this.month + 1, 0).getDate();
    },
    firstDayOfWeek() {
      return new Date(this.year, this.month, 1).getDay();
    },
    monthName() {
      return new Date(this.year, this.month).toLocaleString('default', { month: 'long' });
    },
  },
  methods: {
    toggleSelect(day) {
      // We need a temporary copy to modify, because Vue 2 has issues
      // detecting changes within a Set directly.
      const newSelectedDays = new Set(this.selectedDays);
      if (newSelectedDays.has(day)) {
        newSelectedDays.delete(day);
      } else {
        newSelectedDays.add(day);
      }
      // Assign the new set back to the data property to trigger reactivity
      this.selectedDays = newSelectedDays;
    },
    // Get the correct CSS classes based on selection
    getDayClasses(day) {
      if (this.selectedDays.has(day)) {
        // Selected state: Green liquid glass
        return 'bg-gradient-to-b from-green-500 to-green-600 text-white shadow-green-500/20 border border-green-700/50 shadow-inner shadow-black/30';
      } else {
        // Unselected state: Dark 3D button
        return 'bg-gradient-to-b from-zinc-700 to-zinc-800 text-gray-300 border border-zinc-900/50 border-t-zinc-600/50 shadow-inner';
      }
    },
    // Reset selections and save
    resetSelection() {
      this.selectedDays = new Set();
    },
  },
  // Load data from localStorage when the component is created
  created() {
    const savedDays = localStorage.getItem('dwnSelectedDays');
    if (savedDays) {
      // Parse the saved JSON array and convert it back into a Set
      this.selectedDays = new Set(JSON.parse(savedDays));
    }
  },
};
</script>

<style scoped>
/* These styles are from your other pages for consistency */
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
</style>