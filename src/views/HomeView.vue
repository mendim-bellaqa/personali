<template>
  <div 
    class="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center p-4"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="absolute inset-0 z-0 bg-grid-pattern animate-gridMove"></div>

    <header class="relative z-10 text-center mb-10 shrink-0">
      <h1 class="font-serif text-4xl sm:text-5xl font-bold text-white tracking-wide">Our Collection</h1>
      <p class="text-white/70 text-lg mt-2">Swipe or drag to explore</p>
    </header>

    <div
      ref="scrollContainer"
      @mousedown="startDrag"
      @mouseleave="stopDrag"
      @mouseup="stopDrag"
      @mousemove="onDrag"
      @touchstart="startTouch"
      @touchend="stopTouch"
      @touchmove="onTouch"
      class="relative z-10 w-full flex overflow-x-auto snap-x snap-mandatory py-8 scrollbar-hide cursor-grab touch-pan-x"
      :class="{ 'is-grabbing': isDragging }"
    >
      <div class="snap-center shrink-0">
        <div class="w-[calc(50vw-128px)] sm:w-[calc(50vw-152px)]"></div>
      </div>

      <div
        v-for="card in cards"
        :key="card.id"
        ref="cardElements"
        class="snap-center shrink-0 px-4"
      >
        <component 
          :is="card.link ? 'router-link' : 'div'" 
          :to="card.link" 
          @click.native="handleCardClick"
          class="block"
        >
          <div class="group relative h-80 w-64 rounded-2xl shadow-2xl glowing-border">
            <div class="relative h-full w-full rounded-2xl overflow-hidden">
              <img :src="require('@/assets/card.jpeg')" class="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-soft-light" alt="Card background texture" />
              <div class="absolute inset-0 z-20 p-5 flex flex-col items-center justify-center text-center">
                <h1 class="font-serif text-3xl font-bold text-white text-shadow">{{ card.title }}</h1>
                <h2 class="text-sm font-light text-gray-200 mt-1 text-shadow-sm">{{ card.subtitle }}</h2>
              </div>
            </div>
          </div>
        </component>
      </div>

      <div class="snap-center shrink-0">
        <div class="w-[calc(50vw-128px)] sm:w-[calc(50vw-152px)]"></div>
      </div>
    </div>

    <div class="relative z-10 flex justify-center mt-6 space-x-3">
      <button
        v-for="(card, index) in cards"
        :key="'dot-' + card.id"
        @click="scrollToCard(index)"
        :class="['w-3 h-3 rounded-full transition-all duration-300 touch-manipulation', activeIndex === index ? 'bg-white scale-110' : 'bg-gray-600 hover:bg-gray-400']"
        :aria-label="'Go to card ' + (index + 1)"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      cards: [
        { id: 3, title: 'TSK', subtitle: 'Checklist', link: '/tsk' },
        { id: 1, title: 'PRY', subtitle: 'Tap Counter', link: '/pry' },
        { id: 2, title: 'MED', subtitle: 'Focus Timer', link: '/med' },
        { id: 5, title: 'DWN', subtitle: 'Calendar', link: '/dwn' },
      ],
      activeIndex: 0,
      isDragging: false,
      startX: 0,
      startScrollLeft: 0,
      intersectionObserver: null,
      autoplayInterval: null,
      // Touch support
      startTouchX: 0,
      isTouchDragging: false,
      touchThreshold: 10,
    };
  },
  mounted() {
    this.$nextTick(() => {
      // Detect mobile and adjust behavior
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
    // Autoplay methods
    startAutoplay() {
      this.stopAutoplay();
      this.autoplayInterval = setInterval(() => {
        const nextIndex = (this.activeIndex + 1) % this.cards.length;
        this.scrollToCard(nextIndex);
      }, 4000);
    },
    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    },

    // Touch event handlers
    startTouch(e) {
      this.stopAutoplay();
      const container = this.$refs.scrollContainer;
      this.isTouchDragging = true;
      this.startTouchX = e.touches[0].clientX - container.offsetLeft;
      this.startScrollLeft = container.scrollLeft;
      // Removed e.preventDefault() to allow tap events on children
    },

    stopTouch(e) {
      this.isTouchDragging = false;
      this.isDragging = false;
      
      const moveDistance = Math.abs(e.changedTouches[0].clientX - this.startTouchX);
      if (moveDistance < this.touchThreshold) {
        // It was a tap - let the default behavior (navigation) happen
      } else {
        this.snapToNearest();
      }
    },

    onTouch(e) {
      if (!this.isTouchDragging) return;
      e.preventDefault(); // Prevent only during actual move
      const container = this.$refs.scrollContainer;
      const x = e.touches[0].clientX - container.offsetLeft;
      const walk = (x - this.startTouchX) * 2;
      container.scrollLeft = this.startScrollLeft - walk;
      this.isDragging = true;
    },

    // Mouse drag handlers
    startDrag(e) {
      // Removed if (e.target.closest('a')) to allow drag start on links
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

    // NEW: Snap to nearest after drag
    snapToNearest() {
      const container = this.$refs.scrollContainer;
      const scrollLeft = container.scrollLeft;
      const cardWidth = this.$refs.cardElements[0]?.offsetWidth + 32 || 296; // Approx width + padding
      const index = Math.round(scrollLeft / cardWidth);
      this.scrollToCard(index, 'smooth');
    },

    // Enhanced intersection observer
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

    // Improved scrolling
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

    // Enhanced click handling - Only prevent if actual drag occurred
    handleCardClick(e) {
      if (this.isDragging || this.isTouchDragging) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // No need for setTimeout, flags reset in stop handlers
    },

    // Mouse hover handlers
    handleMouseEnter() {
      this.stopAutoplay();
    },

    handleMouseLeave() {
      setTimeout(() => this.startAutoplay(), 500);
    },
  },
};
</script>

<style scoped>
body { 
  font-family: 'Inter', sans-serif; 
  background-color: #000; 
}

/* Typography */
.font-serif { 
  font-family: 'Playfair Display', serif; 
}

/* Scrollbar hiding */
.scrollbar-hide::-webkit-scrollbar { 
  display: none; 
}
.scrollbar-hide { 
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}

/* Cursor styles */
.cursor-grab { 
  cursor: grab; 
  cursor: -webkit-grab; 
}
.is-grabbing { 
  cursor: grabbing; 
  cursor: -webkit-grabbing; 
}

/* Text shadows */
.text-shadow { 
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7), 0 0 10px rgba(0, 0, 0, 0.5); 
}
.text-shadow-sm { 
  text-shadow: 1px 1px 2px rgba(0, 0, 8, 0.8); 
}

/* Glowing border effects */
.glowing-border { 
  position: relative; 
  overflow: hidden; 
}
.glowing-border::before {
  content: '';
  position: absolute;
  top: 50%; 
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150%; 
  height: 150%;
  background: conic-gradient(from 0deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.3));
  animation: rotate-glow 5s linear infinite;
  opacity: 0.3;
  transition: opacity 0.3s ease-in-out;
}
.glowing-border::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  transition: box-shadow 0.3s ease-in-out;
}
.glowing-border:hover::before, 
.glowing-border:active::before { 
  opacity: 0.8; 
}
.glowing-border:hover::after, 
.glowing-border:active::after { 
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.6); 
}

/* Animations */
@keyframes rotate-glow {
  from { 
    transform: translate(-50%, -50%) rotate(0deg); 
  }
  to { 
    transform: translate(-50%, -50%) rotate(360deg); 
  }
}

.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}

@keyframes gridMove {
  0% { 
    background-position: 0 0; 
  }
  100% { 
    background-position: 50px 50px; 
  }
}

.animate-gridMove {
  animation: gridMove 40s linear infinite;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .scrollbar-hide {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
  }
  
  .snap-center .glowing-border {
    width: calc(100vw - 2rem);
    max-width: 280px;
  }
  
  /* Better mobile spacing */
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .animate-gridMove {
    animation-duration: 60s;
  }
  
  .glowing-border::before {
    animation-duration: 10s;
  }
  
  .transition-all {
    transition: none;
  }
}

/* Touch improvements */
.touch-manipulation {
  touch-action: manipulation;
  min-width: 44px;
  min-height: 44px;
}

.touch-pan-x {
  touch-action: pan-x;
}

/* Smooth button transitions */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>