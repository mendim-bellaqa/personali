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
    <main class="relative z-10 w-full max-w-6xl mx-auto">
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
      ]
    };
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