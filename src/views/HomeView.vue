<template>
  <div class="relative min-h-screen bg-black overflow-hidden">
    <!-- Animated Background Grid -->
    <div class="absolute inset-0 z-0">
      <div class="bg-grid-pattern animate-gridMove"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>
    </div>

    <!-- Header Section -->
    <header class="relative z-10 pt-12 pb-8 px-4 text-center">
      <div class="container mx-auto">
        <div class="animate-fade-in-up">
          <h1 class="font-serif text-5xl md:text-7xl font-bold text-white mb-4 tracking-wider">
            <span class="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              PASS
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-gray-300 font-light mb-8">
            Your Personal Productivity Suite
          </p>
          <div class="inline-flex items-center space-x-2 text-sm text-gray-400">
            <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span>Professional Tools for Modern Productivity</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Card Carousel -->
    <main class="relative z-10 px-4 pb-12">
      <div class="container mx-auto">
        <div 
          ref="scrollContainer"
          class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab touch-pan-x py-8"
          :class="{ 'is-grabbing': isDragging }"
          @mousedown="startDrag"
          @mouseleave="stopDrag"
          @mouseup="stopDrag"
          @mousemove="onDrag"
          @touchstart="startTouch"
          @touchend="stopTouch"
          @touchmove="onTouch"
        >
          <div class="snap-center shrink-0 w-16"></div>
          
          <div
            v-for="(card, index) in cards"
            :key="card.id"
            ref="cardElements"
            class="snap-center shrink-0 px-4"
          >
            <component 
              :is="card.link ? 'router-link' : 'div'" 
              :to="card.link" 
              @click.native="handleCardClick"
              class="block group"
            >
              <div class="card-container">
                <!-- Card Background with Advanced Effects -->
                <div class="card-bg">
                  <img 
                    :src="card.image" 
                    :alt="card.title + ' background'"
                    class="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  />
                  <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 group-hover:from-white/20 group-hover:to-white/10 transition-all duration-500"></div>
                </div>
                
                <!-- Animated Border -->
                <div class="card-border">
                  <div class="card-glow"></div>
                </div>
                
                <!-- Card Content -->
                <div class="relative z-20 p-8 h-80 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <span class="card-number">{{ String(index + 1).padStart(2, '0') }}</span>
                      <div class="card-status" :class="card.status">
                        <div class="w-2 h-2 rounded-full"></div>
                      </div>
                    </div>
                    
                    <h2 class="font-serif text-4xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-200 group-hover:to-purple-300 group-hover:bg-clip-text transition-all duration-500">
                      {{ card.title }}
                    </h2>
                    
                    <p class="text-gray-300 text-lg font-light leading-relaxed mb-6">
                      {{ card.description }}
                    </p>
                    
                    <div class="flex flex-wrap gap-2 mb-6">
                      <span 
                        v-for="tag in card.tags" 
                        :key="tag"
                        class="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-gray-300 border border-white/20 backdrop-blur-sm"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="card-action">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                        {{ card.cta }}
                      </span>
                      <div class="card-arrow">
                        <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </component>
          </div>
          
          <div class="snap-center shrink-0 w-16"></div>
        </div>
      </div>
    </main>

    <!-- Navigation Dots -->
    <div class="relative z-10 flex justify-center pb-8">
      <div class="flex space-x-3">
        <button
          v-for="(card, index) in cards"
          :key="'dot-' + card.id"
          @click="scrollToCard(index)"
          :class="['nav-dot', activeIndex === index ? 'active' : '']"
          :aria-label="'Navigate to ' + card.title"
        >
          <div class="w-2 h-2 rounded-full bg-gray-500 group-hover:bg-gray-300"></div>
        </button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="relative z-10 text-center pb-8 px-4">
      <div class="container mx-auto">
        <div class="text-sm text-gray-500">
          <p>© 2025 PASS - Professional Productivity Suite</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      cards: [
        {
          id: 1,
          title: 'TSK',
          subtitle: 'Task Manager',
          description: 'Organize and track your daily tasks efficiently.',
          tags: ['Tasks', 'Productivity'],
          cta: 'Manage Tasks',
          status: 'active',
          image: require('@/assets/card.jpeg'),
          link: '/tsk'
        },
        {
          id: 2,
          title: 'PRY',
          subtitle: 'Project Tracker',
          description: 'Monitor and manage your projects with ease.',
          tags: ['Projects', 'Tracking'],
          cta: 'Track Projects',
          status: 'coming-soon',
          image: require('@/assets/card.jpeg'),
          link: '/pry'
        },
        {
          id: 3,
          title: 'MED',
          subtitle: 'Focus Timer',
          description: 'Meditate and stay focused with guided sessions.',
          tags: ['Focus', 'Meditation'],
          cta: 'Start Session',
          status: 'coming-soon',
          image: require('@/assets/card.jpeg'),
          link: '/med'
        },
        {
          id: 4,
          title: 'DWN',
          subtitle: 'Calendar',
          description: 'Plan and schedule your important events.',
          tags: ['Calendar', 'Events'],
          cta: 'View Calendar',
          status: 'coming-soon',
          image: require('@/assets/card.jpeg'),
          link: '/dwn'
        }
      ],
      activeIndex: 0,
      isDragging: false,
      startX: 0,
      startScrollLeft: 0,
      intersectionObserver: null,
      autoplayInterval: null,
      startTouchX: 0,
      isTouchDragging: false,
      touchThreshold: 10,
    };
  },
  mounted() {
    this.$nextTick(() => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        this.touchThreshold = 15;
      }
      
      this.setupIntersectionObserver();
      this.scrollToCard(0, 'auto');
      this.startAutoplay();
    });
  },
  beforeDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    this.stopAutoplay();
  },
  methods: {
    startAutoplay() {
      this.stopAutoplay();
      this.autoplayInterval = setInterval(() => {
        const nextIndex = (this.activeIndex + 1) % this.cards.length;
        this.scrollToCard(nextIndex);
      }, 5000);
    },
    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    },

    startTouch(e) {
      this.stopAutoplay();
      const container = this.$refs.scrollContainer;
      this.isTouchDragging = true;
      this.startTouchX = e.touches[0].clientX - container.offsetLeft;
      this.startScrollLeft = container.scrollLeft;
    },

    stopTouch(e) {
      this.isTouchDragging = false;
      this.isDragging = false;
      
      const moveDistance = Math.abs(e.changedTouches[0].clientX - this.startTouchX);
      if (moveDistance < this.touchThreshold) {
        // It was a tap - let the default behavior happen
      } else {
        this.snapToNearest();
      }
    },

    onTouch(e) {
      if (!this.isTouchDragging) return;
      e.preventDefault();
      const container = this.$refs.scrollContainer;
      const x = e.touches[0].clientX - container.offsetLeft;
      const walk = (x - this.startTouchX) * 2;
      container.scrollLeft = this.startScrollLeft - walk;
      this.isDragging = true;
    },

    startDrag(e) {
      this.stopAutoplay();
      const container = this.$refs.scrollContainer;
      this.isDragging = true;
      this.startX = e.pageX - container.offsetLeft;
      this.startScrollLeft = container.scrollLeft;
    },

    stopDrag() {
      this.isDragging = false;
      this.snapToNearest();
    },

    onDrag(e) {
      if (!this.isDragging) return;
      e.preventDefault();
      const container = this.$refs.scrollContainer;
      const x = e.pageX - container.offsetLeft;
      const walk = (x - this.startX) * 2; 
      container.scrollLeft = this.startScrollLeft - walk;
    },

    snapToNearest() {
      const container = this.$refs.scrollContainer;
      const scrollLeft = container.scrollLeft;
      const cardWidth = this.$refs.cardElements[0]?.offsetWidth + 32 || 296;
      const index = Math.round(scrollLeft / cardWidth);
      this.scrollToCard(index, 'smooth');
    },

    setupIntersectionObserver() {
      const options = {
        root: this.$refs.scrollContainer,
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0.3,
      };

      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cardElements = this.$refs.cardElements;
            const cardIndex = cardElements.findIndex(cardRef => cardRef === entry.target);
            if (cardIndex !== -1 && cardIndex !== this.activeIndex) {
              this.activeIndex = cardIndex;
              setTimeout(() => this.startAutoplay(), 3000);
            }
          }
        });
      }, options);

      this.$nextTick(() => {
        if (this.$refs.cardElements) {
          this.$refs.cardElements.forEach(card => {
            this.intersectionObserver.observe(card);
          });
        }
      });
    },

    scrollToCard(index, behavior = 'smooth') {
      this.stopAutoplay();
      const cardElements = this.$refs.cardElements;
      
      if (cardElements && cardElements[index]) {
        const container = this.$refs.scrollContainer;
        const card = cardElements[index];
        const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
        const containerCenter = container.offsetWidth / 2;
        const scrollLeft = cardCenter - containerCenter;
        
        container.scrollTo({
          left: scrollLeft,
          behavior: behavior === 'auto' ? 'auto' : 'smooth'
        });
      }
    },

    handleCardClick(e) {
      if (this.isDragging || this.isTouchDragging) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
  },
};
</script>

<style scoped>
/* Global Styles */
body { 
  font-family: 'Inter', sans-serif; 
  background-color: #000; 
}

/* Background Grid */
.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 60px 60px;
}

@keyframes gridMove {
  0% { background-position: 0 0; }
  100% { background-position: 60px 60px; }
}

.animate-gridMove {
  animation: gridMove 60s linear infinite;
}

/* Animations */
@keyframes fade-in-up {
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
  animation: fade-in-up 1s ease-out;
}

/* Card Container */
.card-container {
  position: relative;
  width: 20rem;
  height: 24rem;
  border-radius: 1.5rem;
  overflow: hidden;
  cursor: pointer;
  transform: transition-all duration-500;
}

.card-container:hover {
  transform: scale(1.05) translateY(-0.5rem);
}

/* Card Background */
.card-bg {
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  overflow: hidden;
}

.card-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  transition: all 0.5s ease;
}

.card-container:hover .card-bg::before {
  background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
}

/* Card Border with Glow */
.card-border {
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  padding: 1px;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
}

.card-glow {
  position: absolute;
  inset: 0;
  border-radius: 1.5rem;
  opacity: 0;
  transition: opacity 0.5s ease;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
}

.card-container:hover .card-glow {
  opacity: 100;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(147, 51, 234, 0.5);
  }
}

/* Card Elements */
.card-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.7);
  font-family: monospace;
}

.card-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.card-status.active {
  background-color: rgba(34, 197, 94, 0.2);
  color: rgb(134, 239, 172);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.card-status.coming-soon {
  background-color: rgba(120, 120, 120, 0.2);
  color: rgb(200, 200, 200);
  border: 1px solid rgba(120, 120, 120, 0.3);
}

/* Action Area */
.card-action {
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.card-container:hover .card-action {
  background-color: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Navigation */
.nav-dot {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.nav-dot:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-dot.active {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Scrollbar */
.scrollbar-hide::-webkit-scrollbar { 
  display: none; 
}
.scrollbar-hide { 
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}

/* Cursor */
.cursor-grab { 
  cursor: grab; 
  cursor: -webkit-grab; 
}
.is-grabbing { 
  cursor: grabbing; 
  cursor: -webkit-grabbing; 
}

/* Touch Support */
.touch-manipulation {
  touch-action: manipulation;
  min-width: 44px;
  min-height: 44px;
}

.touch-pan-x {
  touch-action: pan-x;
}

/* Typography */
.font-serif { 
  font-family: 'Playfair Display', serif; 
}

/* Mobile Optimizations */
@media (max-width: 640px) {
  .card-container {
    width: 18rem;
    height: 20rem;
  }
  
  .card-container:hover {
    transform: scale(1);
  }
  
  .bg-grid-pattern {
    background-size: 40px 40px;
  }
  
  .animate-gridMove {
    animation-duration: 40s;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .animate-gridMove {
    animation-duration: 120s;
  }
  
  .card-container,
  .card-container:hover {
    transition: none;
    transform: none;
  }
}

/* High Contrast */
@media (prefers-contrast: high) {
  .card-border {
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  .card-container:hover .card-border {
    border-color: white;
  }
}
</style>