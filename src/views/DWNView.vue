<template>
  <div class="relative w-full h-full min-h-screen overflow-hidden">
    <!-- Universal Banner -->
    <div class="relative z-50 w-full mb-8">
      <UniversalBanner />
    </div>

    <!-- Main Content with Manual Drag -->
    <main 
      ref="draggableContainer"
      class="relative z-10 w-full max-w-6xl mx-auto px-4 pb-20 pt-20 md:pt-24 cursor-grab active:cursor-grabbing transform will-change-transform" 
      :style="contentStyle"
      @mousedown="startDrag"
    >
      
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tighter mb-2 glitch-hover" data-text="CHRONO_SYNC">
          CHRONO_SYNC
        </h1>
        <p class="text-xs text-cyan-300/60 uppercase tracking-widest font-mono">Temporal Alignment • 2026</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- CALENDAR CONTROL & INFO (Left Stick) -->
        <div class="lg:col-span-4 space-y-6">
          
          <!-- Month/Year Control -->
          <div class="neo-card p-6 text-center">
            <div class="flex items-center justify-between mb-4">
              <button @click="changeMonth(-1)" class="p-2 hover:text-cyan-400 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h2 class="text-2xl font-bold text-white font-mono">{{ monthName }} <span class="text-cyan-500">{{ year }}</span></h2>
              <button @click="changeMonth(1)" class="p-2 hover:text-cyan-400 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs font-mono text-gray-400">
              <div class="p-2 border border-white/10 rounded">Selected: <span class="text-white">{{ selectedDays.size }}</span></div>
              <button @click="resetSelection" class="p-2 border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors">RESET_DATA</button>
            </div>
          </div>

          <!-- Instructions / Stats -->
          <div class="neo-card p-6">
            <h3 class="text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wider">Directives</h3>
            <p class="text-gray-400 text-sm mb-4 leading-relaxed">
              Select dates to mark critical temporal milestones. Data is persisted locally in your neural link (localStorage).
            </p>
            <div class="h-1 w-full bg-gray-800 rounded overflow-hidden">
               <div class="h-full bg-cyan-500 transition-all duration-500" :style="{ width: Math.min((selectedDays.size / 30) * 100, 100) + '%' }"></div>
            </div>
            <div class="flex justify-between mt-2 text-[10px] text-gray-500 font-mono">
               <span>CAPACITY</span>
               <span>{{ Math.round(Math.min((selectedDays.size / 30) * 100, 100)) }}%</span>
            </div>
          </div>

        </div>

        <!-- CALENDAR GRID (Main) -->
        <div class="lg:col-span-8">
          <div class="neo-card p-6 min-h-[500px]">
            
            <!-- Weekday Headers -->
            <div class="grid grid-cols-7 mb-4 border-b border-white/5 pb-2">
              <div v-for="day in weekdays" :key="day" class="text-center text-xs font-bold text-gray-500 uppercase tracking-wider py-2">
                {{ day }}
              </div>
            </div>

            <!-- Days Grid -->
            <div class="grid grid-cols-7 gap-2 md:gap-4">
              <!-- Empty slots for start of month -->
              <div v-for="blank in firstDayOfWeek" :key="'blank-' + blank" class="aspect-square"></div>

              <!-- Actual Days -->
              <div
                v-for="day in daysInMonth"
                :key="day"
                @click="toggleSelect(day)"
                class="relative aspect-square rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
                :class="getDayClasses(day)"
              >
                <span class="text-sm md:text-lg font-mono z-10 relative">{{ day }}</span>
                
                <!-- Selection Glow -->
                <div v-if="selectedDays.has(day)" class="absolute inset-0 bg-cyan-500/20 blur-md rounded-xl"></div>
                
                <!-- Hover Effect -->
                <div class="absolute inset-0 border-2 border-cyan-400/0 group-hover:border-cyan-400/50 rounded-xl transition-all duration-300"></div>
                
                <!-- Tiny indicator for today -->
                <div v-if="isToday(day)" class="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script>
import UniversalBanner from '@/components/UniversalBanner.vue';

export default {
  name: 'DWNView',
  components: { UniversalBanner },
  props: {
    // No props needed
  },
  data() {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      selectedDays: new Set(),
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      panX: 0,
      panY: 0,
      isDragging: false,
      dragStart: { x: 0, y: 0 },
      dragOffset: { x: 0, y: 0 }
    };
  },
  computed: {
    monthName() {
      return new Date(this.year, this.month).toLocaleString('default', { month: 'long' });
    },
    daysInMonth() {
      return new Date(this.year, this.month + 1, 0).getDate();
    },
    firstDayOfWeek() {
      return new Date(this.year, this.month, 1).getDay();
    },
    contentStyle() {
      return { 
        transform: `translate(${this.panX}px, ${this.panY}px)`,
        transition: this.isDragging ? 'none' : 'transform 0.1s ease-out'
      };
    }
  },
  beforeUnmount() {
    this.removeDragListeners();
  },
  watch: {
    selectedDays: {
      handler(newVal) {
        localStorage.setItem('dwnSelectedDays', JSON.stringify(Array.from(newVal)));
      },
      deep: true
    }
  },
  mounted() {
    const saved = localStorage.getItem('dwnSelectedDays');
    if (saved) {
      try {
        this.selectedDays = new Set(JSON.parse(saved));
      } catch (e) {
        console.error('Corrupt calendar data', e);
      }
    }
  },
  methods: {
    startDrag(e) {
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return; // Allow button clicks
      
      this.isDragging = true;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.dragOffset = { x: this.panX, y: this.panY };
      
      window.addEventListener('mousemove', this.onDrag);
      window.addEventListener('mouseup', this.stopDrag);
    },
    onDrag(e) {
      if (!this.isDragging) return;
      const dx = e.clientX - this.dragStart.x;
      const dy = e.clientY - this.dragStart.y;
      
      this.panX = this.dragOffset.x + dx;
      this.panY = this.dragOffset.y + dy;
    },
    stopDrag() {
      this.isDragging = false;
      this.removeDragListeners();
    },
    removeDragListeners() {
      window.removeEventListener('mousemove', this.onDrag);
      window.removeEventListener('mouseup', this.stopDrag);
    },
    changeMonth(delta) {
      this.month += delta;
      if (this.month > 11) {
        this.month = 0;
        this.year++;
      } else if (this.month < 0) {
        this.month = 11;
        this.year--;
      }
    },
    toggleSelect(day) {
      const newSet = new Set(this.selectedDays);
      if (newSet.has(day)) newSet.delete(day);
      else newSet.add(day);
      this.selectedDays = newSet;
    },
    resetSelection() {
      if (confirm('RESET ALL TEMPORAL MARKERS?')) {
        this.selectedDays = new Set();
      }
    },
    isToday(day) {
      const today = new Date();
      return today.getDate() === day && 
             today.getMonth() === this.month && 
             today.getFullYear() === this.year;
    },
    getDayClasses(day) {
      if (this.selectedDays.has(day)) {
        return 'bg-cyan-600/30 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]';
      }
      return 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white';
    }
  }
};
</script>

<style scoped>
/* Reusing Neo-Glass styles from TskView for consistency */
.neo-card {
  background: rgba(10, 15, 30, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
}

.glitch-hover:hover {
  animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite;
  color: #06b6d4;
}

@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}
</style>