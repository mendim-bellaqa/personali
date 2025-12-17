<template>
  <div class="relative min-h-[85vh] flex flex-col">
    <UniversalBanner />
    
    <!-- Hero Section -->
    <header class="relative z-10 pt-16 pb-8 px-6 text-center flex flex-col items-center justify-center flex-grow min-h-[30vh] animate-fade-in-up">
      <div class="container max-w-2xl mx-auto">
        <h1 class="font-sans text-5xl md:text-8xl font-bold tracking-tight mb-4 mt-12 text-white">
          <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            PASS
          </span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-400 font-light leading-relaxed mb-8">
          The productivity suite for your <span class="text-white font-medium">ambition</span>.
        </p>
        
        <div class="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur-md border border-white/10 mx-auto w-fit">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span class="text-xs font-medium text-gray-300 uppercase tracking-widest">System Operational</span>
        </div>
      </div>
    </header>

    <!-- Cards Carousel -->
    <main class="relative z-10 w-full mb-auto">
      <!-- Scroll Container -->
      <div 
        class="flex overflow-x-auto snap-x snap-center snap-mandatory scrollbar-none py-10 px-6 gap-6 md:overflow-visible md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:justify-items-center md:py-16"
        style="scrollbar-width: none; -ms-overflow-style: none;"
      >
        <div class="snap-start shrink-0 w-4 md:hidden"></div> <!-- Spacer -->

        <router-link
          v-for="(card, index) in cards"
          :key="card.id"
          :to="card.link"
          :style="{ animationDelay: `${index * 0.1}s` }"
          class="snap-center shrink-0 w-[85vw] max-w-[340px] md:w-full group relative animate-fade-in-up"
        >
          <!-- Card Container -->
          <div class="liquid-card relative h-[420px] rounded-3xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02]">
            
            <!-- Content -->
            <div class="relative z-20 h-full flex flex-col justify-end p-8">
              <div class="mb-auto pt-4 flex justify-between items-start">
                <span class="text-xs font-bold tracking-widest text-white/50 border border-white/10 px-2 py-1 rounded">{{ card.id.toString().padStart(2, '0') }}</span>
                <span v-if="card.status === 'active'" class="h-2 w-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
              </div>

              <h2 class="text-3xl font-bold text-white mb-2 leading-tight group-hover:text-blue-200 transition-colors">
                {{ card.title }}
              </h2>
              <p class="text-sm text-gray-400 mb-6 line-clamp-2 group-hover:text-gray-200 transition-colors">
                {{ card.description }}
              </p>

              <div class="flex items-center text-sm font-medium text-white group-hover:translate-x-1 transition-transform">
                {{ card.cta }}
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </div>
          </div>
        </router-link>

        <div class="snap-start shrink-0 w-4 md:hidden"></div> <!-- Spacer -->
      </div>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 text-center pb-24 md:pb-8 text-white/20 text-xs">
      <p>&copy; 2025 PASS OS</p>
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
        {
          id: 1,
          title: 'Tasks',
          description: 'Capture, organize, and execute your daily objectives.',
          cta: 'Open TSK',
          status: 'active',
          link: '/tsk',
          image: require('@/assets/card.jpeg')
        },
        {
          id: 2,
          title: 'Projects',
          description: 'High-level planning and progress tracking.',
          cta: 'View PRY',
          status: 'coming-soon',
          link: '/pry',
          image: require('@/assets/card.jpeg')
        },
        {
          id: 3,
          title: 'Focus',
          description: 'Immersive sessions to maximize deep work.',
          cta: 'Start MED',
          status: 'coming-soon',
          link: '/med',
          image: require('@/assets/card.jpeg')
        },
        {
          id: 4,
          title: 'Calendar',
          description: 'Visualize your timeline and schedule.',
          cta: 'Check DWN',
          status: 'coming-soon',
          link: '/dwn',
          image: require('@/assets/card.jpeg')
        }
      ]
    };
  }
};
</script>

<style scoped>
/* Smooth Scrollbar Hiding */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

/* Entrance Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

/* Liquid Glass Animation */
@keyframes liquidMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.liquid-card {
  background: linear-gradient(
    60deg,
    rgba(255, 255, 255, 0.1),
    rgba(50, 100, 255, 0.15),
    rgba(255, 255, 255, 0.1),
    rgba(100, 200, 255, 0.15)
  );
  background-size: 300% 300%;
  animation: liquidMove 15s ease infinite;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.3),
    inset 0 0 32px 0 rgba(255, 255, 255, 0.05);
}

.liquid-card:hover {
  background-size: 200% 200%;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.4),
    inset 0 0 40px 0 rgba(255, 255, 255, 0.1);
}
</style>