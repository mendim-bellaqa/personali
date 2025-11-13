<!-- C:\laragon\www\pass\src\views\DWNView.vue -->
<template>
  <div class="relative min-h-screen bg-black overflow-hidden">
    <UniversalBanner />
    
    <!-- Enhanced Animated Background -->
    <div class="fixed inset-0 z-0">
      <div class="animated-bg">
        <div class="particles">
          <div v-for="i in 25" :key="i" class="particle" :style="{ '--delay': i * 0.4 + 's' }"></div>
        </div>
        <div class="bg-gradient-orb orb-1"></div>
        <div class="bg-gradient-orb orb-2"></div>
        <div class="bg-gradient-orb orb-3"></div>
        <div class="floating-calendar-elements">
          <div v-for="i in 8" :key="'calendar-element-' + i" class="floating-element" :style="{ '--delay': i * 1.2 + 's', '--size': (15 + Math.random() * 30) + 'px' }"></div>
        </div>
      </div>
    </div>

    <!-- Main Container -->
    <div class="relative z-10 w-full max-w-2xl mx-auto pt-32 px-5 pb-20">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <div class="flex items-center justify-center gap-4 mb-6">
          <div class="calendar-icon">
            <svg class="w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            CALENDAR
          </h1>
        </div>
        <p class="text-gray-300 text-lg">Plan your important moments</p>
      </div>

      <!-- Calendar Container -->
      <div class="calendar-container liquid-glass-card">
        <div class="calendar-content">
          <!-- Month Navigation -->
          <div class="calendar-header">
            <button @click="previousMonth" class="nav-btn">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 class="text-2xl font-bold text-white">{{ monthName }} {{ year }}</h2>
            <button @click="nextMonth" class="nav-btn">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Weekday Headers -->
          <div class="weekday-grid">
            <div v-for="day in weekdays" :key="day" class="weekday-header">
              {{ day }}
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="calendar-grid">
            <!-- Blank spaces for days before month starts -->
            <div v-for="blank in firstDayOfWeek" :key="'blank-' + blank" class="calendar-cell empty"></div>

            <!-- Days of the month -->
            <div
              v-for="day in daysInMonth"
              :key="day"
              @click="toggleSelect(day)"
              class="calendar-day"
              :class="getDayClasses(day)"
            >
              <span class="day-number">{{ day }}</span>
              <div v-if="selectedDays.has(day)" class="selected-indicator">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls Section -->
      <div class="controls-container liquid-glass-card mt-8">
        <div class="controls-content">
          <div class="selected-info">
            <span class="text-gray-300">Selected dates: </span>
            <span class="selected-count">{{ selectedDays.size }}</span>
          </div>
          <div class="control-buttons">
            <button @click="resetSelection" class="control-btn reset">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
              Reset
            </button>
            <router-link to="/" class="control-btn back">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UniversalBanner from '@/components/UniversalBanner.vue';

export default {
  name: 'DWNView',
  components: { UniversalBanner },
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
        // Selected state: Blue highlighting
        return 'day-selected bg-blue-500 text-white border-blue-400 shadow-lg';
      } else {
        // Unselected state: Dark 3D button
        return 'day-unselected text-gray-300 hover:bg-gray-700';
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

/* Calendar Day Styles */
.day-selected {
  background: rgba(59, 130, 246, 0.8);
  border: 2px solid rgba(59, 130, 246, 0.6);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  transform: scale(1.1);
}

.day-unselected {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.day-unselected:hover {
  background: rgba(107, 114, 128, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.05);
}
</style>