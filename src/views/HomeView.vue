<template>
  <div class="relative min-h-screen bg-black overflow-hidden">
    <UniversalBanner />
    <!-- Animated Background Grid -->
    <div class="absolute inset-0 z-0">
      <div class="bg-grid-pattern animate-gridMove"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>
    </div>

    <!-- Header Section -->
    <header class="relative z-10 pt-12 pb-8 px-5 text-center">
      <div class="container mx-auto mt-16">
        <div class="animate-fade-in-up">
          <h1 class="font-serif text-5xl md:text-7xl font-bold text-white mb-4 tracking-wider">
            <span class="bg-gradient-to-r from-white mt-10 via-blue-100 to-purple-200 bg-clip-text text-transparent">
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
  <main class="relative z-10 px-5 pb-12 pt-24">
      <div class="container mx-auto">
        <div
          ref="scrollContainer"
          class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab touch-pan-y py-8 carousel-scroll"
          :class="{ 'is-grabbing': isDragging, 'is-paused': isPaused }"
          @mousedown="startDrag"
          @mouseleave="stopDrag"
          @mouseup="stopDrag"
          @mousemove="onDrag"
          @touchstart="startTouch"
          @touchend="stopTouch"
          @touchcancel="stopTouch"
          @touchmove="onTouch"
        >
          <div class="snap-center shrink-0 w-16"></div>
          
          <div
            v-for="(entry) in displayCards"
            :key="entry.item.id + '-' + entry.origIndex"
            ref="cardElements"
            :data-orig-index="entry.origIndex"
            class="snap-center shrink-0 px-4"
          >
            <component 
              :is="entry.item.link ? 'router-link' : 'div'" 
              :to="entry.item.link" 
              @click.native="handleCardClick"
              class="block group"
            >
              <div class="card-container">
                <!-- Card Background with Advanced Effects -->
                <div class="card-bg">
                  <img 
                    :src="entry.item.image" 
                    :alt="entry.item.title + ' background'"
                    class="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  />
                  <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 group-hover:from-white/20 group-hover:to-white/10 transition-all duration-500"></div>
                </div>
                
                <!-- Animated Border -->
                <div class="card-border">
                  <div class="card-glow"></div>
                </div>
                
                <!-- Card Content -->
                <div :class="['relative z-20 p-6 h-72 flex flex-col justify-between', (entry.origIndex === activeIndex && !isDragging) ? 'active-card-wrap' : '']">
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <span class="card-number">{{ String((entry.origIndex || 0) + 1).padStart(2, '0') }}</span>
                      <div class="card-status" :class="entry.item.status">
                        <div class="w-2 h-2 rounded-full"></div>
                      </div>
                    </div>
                    
                    <h2 class="font-serif text-3xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-200 group-hover:to-purple-300 group-hover:bg-clip-text transition-all duration-500">
                      {{ entry.item.title }}
                    </h2>
                    
                    <p class="text-gray-300 text-base font-light leading-relaxed mb-4">
                      {{ entry.item.description }}
                    </p>
                    
                    <div class="flex flex-wrap gap-2 mb-4">
                      <span
                        v-for="tag in entry.item.tags"
                        :key="tag"
                        class="px-2 py-1 text-xs font-medium rounded-full bg-white/10 text-gray-300 border border-white/20 backdrop-blur-sm"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="card-action">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                        {{ entry.item.cta }}
                      </span>
                      <div class="card-arrow">
                        <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <footer class="relative z-10 text-center pb-8 px-5">
      <div class="container mx-auto">
        <div class="text-sm text-gray-500">
          <p>© 2025 PASS - Professional Productivity Suite</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import UniversalBanner from '@/components/UniversalBanner.vue';
export default {
  name: 'HomeView',
  components: { UniversalBanner },
  computed: {
    displayCards() {
      // render cards once (no autoplay loop). Each entry exposes the original index.
      return this.cards.map((c, i) => ({ item: c, origIndex: i }));
    }
    
  },
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
      isPaused: false,
      startX: 0,
      startScrollLeft: 0,
      intersectionObserver: null,
      startTouchX: 0,
      startTouchY: 0,
      isTouchDragging: false,
      touchThreshold: 10,
      currentDirection: 'right', // 'right', 'left', 'up', 'down'
      dragStartTime: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        this.touchThreshold = 15;
      }
      
      this.setupIntersectionObserver();
      // show first card by default
      this.$nextTick(() => this.scrollToCard(0, 'auto'));
    });
  },
  beforeDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    // no RAF to stop anymore
  },
  methods: {
    // compute nearest card index based on container center
    computeNearestCard() {
      const container = this.$refs.scrollContainer;
      const cardElements = this.$refs.cardElements || [];
      if (!container || !cardElements || cardElements.length === 0) return 0;

      const containerCenter = container.scrollLeft + (container.offsetWidth / 2);
      let best = 0;
      let bestDist = Infinity;
      cardElements.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
        const d = Math.abs(cardCenter - containerCenter);
        if (d < bestDist) {
          bestDist = d;
          best = idx;
        }
      });
      return best;
    },

    startTouch(e) {
      this.isTouchDragging = true;
      this.isPaused = true;
      const container = this.$refs.scrollContainer;
      // store both raw clientX (for swipe direction) and offset-based start for dragging
      this.startTouchXRaw = e.touches[0].clientX;
      this.startTouchX = e.touches[0].clientX - container.getBoundingClientRect().left;
      this.startTouchY = e.touches[0].clientY - container.getBoundingClientRect().top;
      this.startScrollLeft = container.scrollLeft;
      this.startScrollTop = container.scrollTop;
      this.dragStartTime = Date.now();
    },

    stopTouch(e) {
      // handle end of touch - decide swipe direction vs tap
      this.isTouchDragging = false;
      const endX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : this.startTouchXRaw;
      const endY = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : this.startTouchY;
      const dx = endX - (this.startTouchXRaw || 0);
      const dy = endY - (this.startTouchY || 0);
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // If horizontal swipe dominates and passes threshold, go to next/prev card
      const SWIPE_THRESHOLD = 40; // px
      if (absDx > SWIPE_THRESHOLD && absDx > absDy) {
        if (dx < 0) {
          // swipe left -> next
          this.scrollToCard(this.activeIndex + 1, 'auto');
        } else {
          // swipe right -> previous
          this.scrollToCard(this.activeIndex - 1, 'auto');
        }
      } else {
        // not a decisive swipe — snap to nearest
        const nearest = this.computeNearestCard();
        this.scrollToCard(nearest, 'auto');
      }
      this.isDragging = false;
    },

    onTouch(e) {
      if (!this.isTouchDragging) return;
      // allow vertical page scroll if user is scrolling mostly vertically
      const container = this.$refs.scrollContainer;
      const x = e.touches[0].clientX - container.getBoundingClientRect().left;
      const y = e.touches[0].clientY - container.getBoundingClientRect().top;
      const dx = Math.abs(x - (this.startTouchX || 0));
      const dy = Math.abs(y - (this.startTouchY || 0));

      // If vertical movement is larger, let browser handle it by not preventing default
      if (dy > dx && dy > 8) {
        // allow page vertical scroll
        return;
      }

      e.preventDefault();
      const walkX = (x - this.startTouchX) * 1.5;
      container.scrollLeft = this.startScrollLeft - walkX;
      this.isDragging = true;
    },

    startDrag(e) {
      this.isDragging = true;
      this.isPaused = true;
      
      const container = this.$refs.scrollContainer;
      this.startX = e.pageX - container.offsetLeft;
      this.startScrollLeft = container.scrollLeft;
      this.dragStartTime = Date.now();
      
      // (no hold detection) keep RAF running but paused
    },

    stopDrag() {
      this.isDragging = false;
      // Snap to nearest card after drag
      const nearest = this.computeNearestCard();
      this.scrollToCard(nearest, 'auto');
    },

    onDrag(e) {
      if (!this.isDragging) return;
      e.preventDefault();
      
      const container = this.$refs.scrollContainer;
      const x = e.pageX - container.offsetLeft;
      const walk = (x - this.startX) * 1.5;
      container.scrollLeft = this.startScrollLeft - walk;
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
            if (cardIndex !== -1) {
              const logical = ((cardIndex % this.cards.length) + this.cards.length) % this.cards.length;
              if (logical !== this.activeIndex) {
                this.activeIndex = logical;
              }
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
      const container = this.$refs.scrollContainer;
      const cardElements = this.$refs.cardElements;
      if (!cardElements || cardElements.length === 0) return;
      const targetIndex = Math.max(0, Math.min(index, cardElements.length - 1));
      const card = cardElements[targetIndex];
      if (card) {
        const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
        const containerCenter = container.offsetWidth / 2;
        const scrollLeft = cardCenter - containerCenter;
        container.scrollTo({ left: scrollLeft, behavior: behavior === 'auto' ? 'auto' : 'smooth' });
        this.activeIndex = card?.dataset?.origIndex !== undefined ? Number(card.dataset.origIndex) : targetIndex;
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
  width: 18rem;
  height: 22rem;
  border-radius: 1.5rem;
  overflow: hidden;
  cursor: pointer;
  transform: transition-all duration-500;
}

.card-container:hover {
  transform: scale(1.03) translateY(-0.3rem);
}

/* Active centered card styling for smoother in/out motion */
.active-card-wrap {
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 420ms ease;
  transform: translateY(-8px) scale(1.04);
  z-index: 40;
}

.card-container { transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1); }

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

.carousel-scroll { scroll-behavior: smooth; }

/* Cursor */
.cursor-grab { 
  cursor: grab; 
  cursor: -webkit-grab; 
}
.is-grabbing {
  cursor: grabbing;
  cursor: -webkit-grabbing;
}

.is-paused {
  cursor: default;
}

/* Touch Support */
.touch-manipulation {
  touch-action: manipulation;
  min-width: 44px;
  min-height: 44px;
}

.touch-pan-y {
  touch-action: pan-y;
}

/* Typography */
.font-serif { 
  font-family: 'Playfair Display', serif; 
}

/* Mobile Optimizations */
@media (max-width: 640px) {
  .card-container {
    width: 16rem;
    height: 20rem;
  }
  
  .card-container:hover {
    transform: scale(1.02);
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