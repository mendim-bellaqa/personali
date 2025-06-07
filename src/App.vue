<!-- src/views/HomeView.vue -->
<template>
  <div class="relative min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden">
    
    <header class="text-center mb-10 shrink-0">
      <h1 class="font-serif text-4xl sm:text-5xl font-bold text-white tracking-wide">Our Collection</h1>
      <p class="text-white/70 text-lg mt-2">Swipe to explore</p>
    </header>

    <!-- HORIZONTAL SCROLL CONTAINER -->
    <div class="w-full flex overflow-x-auto snap-x snap-mandatory py-8 scrollbar-hide">
      
      <div class="snap-center shrink-0"><div class="w-4 sm:w-1/12"></div></div>
      
      <!-- v-for loop for the cards -->
      <div 
        v-for="card in cards" 
        :key="card.id"
        class="snap-center shrink-0 px-4 sm:px-6"
      >
        <!-- 
          THE FIX IS HERE: We wrap the card in a router-link or a regular div
        -->
        <component :is="card.link ? 'router-link' : 'div'" :to="card.link">
          <div class="group relative h-80 w-64 rounded-2xl shadow-2xl glowing-border">
            <div class="relative h-full w-full rounded-2xl overflow-hidden">
              <img :src="require('@/assets/card.jpeg')" class="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-soft-light" alt="Card background texture"/>
              <div class="absolute inset-0 z-20 p-5 flex flex-col items-center justify-center text-center">
                <h1 class="font-serif text-3xl font-bold text-white text-shadow">{{ card.title }}</h1>
                <h2 class="text-sm font-light text-gray-200 mt-1 text-shadow-sm">{{ card.subtitle }}</h2>
              </div>
            </div>
          </div>
        </component>

      </div>

      <div class="snap-center shrink-0"><div class="w-4 sm:w-1/12"></div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView', // Changed name to HomeView
  data() {
    return {
      cards: [
        // THE FIX: Add an `id` and a `link` property
        { id: 1, title: 'PRY', subtitle: '#######', link: '/pry' },
        { id: 2, title: 'MED', subtitle: '“#######”', link: null }, // No link
        { id: 3, title: 'TSK', subtitle: '#######', link: null },
        { id: 4, title: '#######', subtitle: '#######', link: null },
        { id: 5, title: '#######', subtitle: '#######', link: null },
        { id: 6, title: '#######', subtitle: '#######', link: null },
        { id: 7, title: '#######', subtitle: '#######', link: null },
        { id: 8, title: '#######', subtitle: '#######', link: null }
      ],
    };
  },
};
</script>

<style>
/* All your previous styles go here, no changes needed */
body { font-family: 'Inter', sans-serif; }
.font-serif { font-family: 'Playfair Display', serif; }
/* ... etc ... */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.text-shadow {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7), 
               0 0 10px rgba(0, 0, 0, 0.5);
}
.text-shadow-sm {
  text-shadow: 1px 1px 2px rgba(0, 0, 8, 0.8);
}
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
.glowing-border:hover::before, .glowing-border:active::before {
  opacity: 0.8;
}
.glowing-border:hover::after, .glowing-border:active::after {
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.6);
}
@keyframes rotate-glow {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>