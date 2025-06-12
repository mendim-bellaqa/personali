<template>
  <div class="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center p-4">
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
      class="relative z-10 w-full flex overflow-x-auto snap-x snap-mandatory py-8 scrollbar-hide cursor-grab"
      :class="{ 'is-grabbing': isDragging }"
    >
      <div class="snap-center shrink-0"><div class="w-[calc(50vw-128px)] sm:w-[calc(50vw-152px)]"></div></div>

      <div
        v-for="card in cards"
        :key="card.id"
        ref="cardElements"
        class="snap-center shrink-0 px-4"
      >
        <component :is="card.link ? 'router-link' : 'div'" :to="card.link" @click.native="handleCardClick">
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

      <div class="snap-center shrink-0"><div class="w-[calc(50vw-128px)] sm:w-[calc(50vw-152px)]"></div></div>
    </div>

    <div class="relative z-10 flex justify-center mt-6 space-x-3">
      <button
        v-for="(card, index) in cards"
        :key="'dot-' + card.id"
        @click="scrollToCard(index)"
        :class="['w-3 h-3 rounded-full transition-all duration-300', activeIndex === index ? 'bg-white scale-110' : 'bg-gray-600 hover:bg-gray-400']"
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
        { id: 1, title: 'PRY', subtitle: 'Tap Counter', link: '/pry' },
        { id: 2, title: 'MED', subtitle: 'Focus Timer', link: '/med' },
        { id: 3, title: 'TSK', subtitle: 'Checklist', link: '/tsk' },
        { id: 4, title: 'C14', subtitle: 'Number Selector', link: '/c14' },
        { id: 5, title: 'DWN', subtitle: 'Calendar', link: '/dwn' },
        { id: 6, title: 'CRSN', subtitle: 'Coming Soon', link: null },
        { id: 7, title: 'TBD', subtitle: 'Coming Soon', link: null },
      ],
      activeIndex: 0,
      isDragging: false,
      startX: 0,
      startScrollLeft: 0,
      intersectionObserver: null,
      autoplayInterval: null, // To hold the ID of our interval
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setupIntersectionObserver();
      // --- FIX: Scroll to the first card on load to center it ---
      this.scrollToCard(0, 'auto'); // 'auto' behavior for instant scroll
      // Start the autoplay after a short delay
      this.startAutoplay();
    });
  },
  beforeDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    // --- NEW: Clean up the autoplay interval to prevent memory leaks ---
    this.stopAutoplay();
  },
  methods: {
    // --- NEW AUTOPLAY METHODS ---
    startAutoplay() {
      // Clear any existing interval before starting a new one
      this.stopAutoplay();
      this.autoplayInterval = setInterval(() => {
        // Loop back to the beginning if at the end
        const nextIndex = (this.activeIndex + 1) % this.cards.length;
        this.scrollToCard(nextIndex);
      }, 4000); // Change 4000ms (4 seconds) to your desired speed
    },
    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    },
    // --- UPDATED DRAG & SCROLL METHODS ---
    startDrag(e) {
      this.stopAutoplay(); // Stop autoplay when user interacts
      const container = this.$refs.scrollContainer;
      this.isDragging = true;
      this.startX = e.pageX - container.offsetLeft;
      this.startScrollLeft = container.scrollLeft;
    },
    stopDrag() {
      this.isDragging = false;
    },
    onDrag(e) {
      if (!this.isDragging) return;
      e.preventDefault();
      const container = this.$refs.scrollContainer;
      const x = e.pageX - container.offsetLeft;
      const walk = (x - this.startX) * 2; 
      container.scrollLeft = this.startScrollLeft - walk;
    },
    setupIntersectionObserver() {
      const options = {
        root: this.$refs.scrollContainer,
        rootMargin: '0px',
        threshold: 0.6,
      };
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cardIndex = this.$refs.cardElements.findIndex(cardRef => cardRef === entry.target);
            if(cardIndex !== -1) {
              this.activeIndex = cardIndex;
            }
          }
        });
      }, options);
      this.$refs.cardElements.forEach(card => {
        this.intersectionObserver.observe(card);
      });
    },
    scrollToCard(index, behavior = 'smooth') {
      this.stopAutoplay(); // Stop autoplay when user clicks a dot
      const cardElements = this.$refs.cardElements;
      if (cardElements && cardElements[index]) {
        cardElements[index].scrollIntoView({
          behavior: behavior, // Use the provided behavior ('smooth' or 'auto')
          block: 'nearest',
          inline: 'center',
        });
      }
    },
    handleCardClick(e) {
      if(this.isDragging) {
        e.preventDefault();
      }
    },
  },
};
</script>

<style>
body { font-family: 'Inter', sans-serif; background-color: #000; }
.font-serif { font-family: 'Playfair Display', serif; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.cursor-grab { cursor: grab; cursor: -webkit-grab; }
.is-grabbing { cursor: grabbing; cursor: -webkit-grabbing; }
.text-shadow { text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7), 0 0 10px rgba(0, 0, 0, 0.5); }
.text-shadow-sm { text-shadow: 1px 1px 2px rgba(0, 0, 8, 0.8); }
.glowing-border { position: relative; overflow: hidden; }
.glowing-border::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 150%; height: 150%;
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
.glowing-border:hover::before, .glowing-border:active::before { opacity: 0.8; }
.glowing-border:hover::after, .glowing-border:active::after { box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.6); }
@keyframes rotate-glow {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}
@keyframes gridMove {
  0% { background-position: 0 0; }
  100% { background-position: 50px 50px; }
}
.animate-gridMove {
  animation: gridMove 40s linear infinite;
}
</style>