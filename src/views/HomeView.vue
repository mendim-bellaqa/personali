<template>
  <div class="relative min-h-screen flex flex-col items-center justify-center p-6">
    <UniversalBanner />
    
    <!-- Hero Section -->
    <header class="relative z-10 pt-16 pb-12 text-center animate-fade-in">
      <h1 class="font-sans text-6xl md:text-9xl font-black tracking-tighter mb-4 text-white">
        PASS
      </h1>
      <p class="text-lg md:text-xl text-white/40 font-light tracking-widest uppercase">
        Personal Operating System
      </p>
    </header>

    <!-- Navigation Boxes -->
    <main class="relative z-10 w-full max-w-6xl mx-auto mb-16">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 px-4">
        <router-link
          v-for="(card, index) in cards"
          :key="card.id"
          :to="card.link"
          class="flex flex-col items-center group cursor-pointer"
          :style="{ animationDelay: `${index * 0.15}s` }"
        >
          <!-- Box Image -->
          <div class="relative w-full aspect-square max-w-[200px] mb-6 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-4">
            <div class="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src="@/assets/box.png" 
              class="w-full h-full object-contain relative z-10 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" 
              :alt="card.title" 
            />
          </div>

          <!-- Label -->
          <div class="text-center overflow-hidden">
            <h2 class="text-xl md:text-2xl font-bold text-white/70 group-hover:text-white transition-all duration-300 uppercase tracking-widest">
              {{ card.title }}
            </h2>
            <div class="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 mt-2"></div>
          </div>
        </router-link>
      </div>
    </main>

    <!-- Year Progress Widget -->
    <div class="relative z-10 w-full max-w-4xl mx-auto mb-16 px-6">
      <div class="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-2xl hover:border-white/20 transition-all duration-500">
        <!-- Widget Header -->
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-white font-bold text-base mb-0.5">Year Progress</h3>
            <p class="text-white/40 text-xs">{{ currentYear }} • Day {{ dayOfYear }} of {{ totalDaysInYear }}</p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-black text-white mb-0.5">{{ progressPercent }}%</div>
            <div class="text-white/40 text-[10px]">{{ daysRemaining }} days left</div>
          </div>
        </div>

        <!-- Dots Grid -->
        <div class="grid gap-[2px]" :style="{ gridTemplateColumns: `repeat(${dotsPerRow}, 1fr)` }">
          <div
            v-for="day in totalDaysInYear"
            :key="day"
            :class="[
              'aspect-square rounded-full transition-all duration-300 cursor-pointer backdrop-blur-sm',
              day <= dayOfYear 
                ? 'bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.6),inset_0_0_8px_rgba(255,255,255,0.3)] hover:scale-125 hover:shadow-[0_0_12px_rgba(255,255,255,0.8),inset_0_0_12px_rgba(255,255,255,0.4)]' 
                : 'bg-white/15 border border-white/20 hover:bg-white/25 hover:scale-110 hover:shadow-[0_0_6px_rgba(255,255,255,0.3)]'
            ]"
            :title="`Day ${day}`"
          ></div>
        </div>
      </div>
    </div>

    <!-- Status Indicator -->
    <div class="mt-20 relative z-10 flex items-center gap-3 px-6 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md opacity-60">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">System Operational</span>
    </div>

    <!-- Footer -->
    <footer class="absolute bottom-8 text-white/10 text-[10px] tracking-[0.5em] uppercase">
      &copy; 2026 PASS OS
    </footer>
  </div>
</template>

<script>
import UniversalBanner from '@/components/UniversalBanner.vue';

export default {
  name: 'HomeView',
  components: { UniversalBanner },
  data() {
    return {
      cards: [
        { id: 1, title: 'Tasks', link: '/tsk' },
        { id: 2, title: 'Projects', link: '/pry' },
        { id: 3, title: 'Focus', link: '/med' },
        { id: 4, title: 'Calendar', link: '/dwn' }
      ],
      windowWidth: window.innerWidth
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    totalDaysInYear() {
      // Check if it's a leap year
      const year = this.currentYear;
      return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
    },
    dayOfYear() {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now - start;
      const oneDay = 1000 * 60 * 60 * 24;
      return Math.floor(diff / oneDay);
    },
    progressPercent() {
      return Math.round((this.dayOfYear / this.totalDaysInYear) * 100);
    },
    daysRemaining() {
      return this.totalDaysInYear - this.dayOfYear;
    },
    dotsPerRow() {
      // Responsive grid: adjust dots per row based on screen width
      if (this.windowWidth < 640) return 20;  // Mobile
      if (this.windowWidth < 1024) return 30; // Tablet
      return 52; // Desktop (approximately 7 rows for 365 days)
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    }
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

body {
  background: transparent;
}
</style>