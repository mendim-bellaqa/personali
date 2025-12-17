<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-[#000000]/80 backdrop-blur-xl border-t border-white/10 pb-safe-area-bottom pt-2 px-6">
    <div class="flex justify-between items-center max-w-sm mx-auto h-[60px]">
      <router-link 
        v-for="item in navItems" 
        :key="item.path" 
        :to="item.path"
        class="flex flex-col items-center justify-center space-y-1 w-12 h-12 rounded-xl transition-all duration-300 hover:scale-105"
        :class="isActive(item.path) ? 'text-white scale-105' : 'text-gray-500 hover:text-gray-300 hover:scale-105'"
      >
        <component :is="item.icon" class="w-6 h-6" :class="isActive(item.path) ? 'fill-current' : 'stroke-current fill-none'" />
        <!-- Optional: Label -->
        <!-- <span class="text-[10px] font-medium">{{ item.label }}</span> -->
        
        <!-- Active Indicator Dot -->
        <span 
          v-if="isActive(item.path)" 
          class="absolute bottom-1 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        ></span>
      </router-link>
    </div>
  </nav>
</template>

<script>
// Simple Icon Components as functional components or raw paths
const HomeIcon = { template: '<svg viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>' };
const TaskIcon = { template: '<svg viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>' };
const ProjectIcon = { template: '<svg viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>' };
const FocusIcon = { template: '<svg viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' };
const CalendarIcon = { template: '<svg viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>' };

export default {
  name: 'BottomNav',
  data() {
    return {
      navItems: [
        { path: '/', label: 'Home', icon: HomeIcon },
        { path: '/tsk', label: 'Tasks', icon: TaskIcon },
        { path: '/project', label: 'Projects', icon: ProjectIcon }, // Assuming path based on task/App.vue inspection
        { path: '/med', label: 'Focus', icon: FocusIcon },
        { path: '/dwn', label: 'Calendar', icon: CalendarIcon },
      ]
    }
  },
  methods: {
    isActive(path) {
      if (path === '/') return this.$route.path === '/';
      return this.$route.path.startsWith(path);
    }
  }
}
</script>

<style scoped>
.pb-safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>
