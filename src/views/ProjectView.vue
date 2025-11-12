<template>
  <div class="min-h-screen bg-black overflow-hidden flex items-center justify-center p-5 text-white select-none relative">
    <!-- Universal Banner -->
    <UniversalBanner />
    
    <!-- Animated Background with Particles -->
    <div class="fixed inset-0 z-0">
      <div class="animated-bg">
        <div class="particles">
          <div v-for="i in 20" :key="i" class="particle" :style="{ '--delay': i * 0.5 + 's' }"></div>
        </div>
        <div class="bg-gradient-orb orb-1"></div>
        <div class="bg-gradient-orb orb-2"></div>
        <div class="bg-gradient-orb orb-3"></div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="relative z-10 w-full max-w-4xl mx-auto main-center">
      <div class="project-container liquid-glass-card">
        <div class="form-header">
          <h2 class="text-2xl font-bold text-white mb-3">Projects</h2>
          <p class="text-gray-300 text-sm">Manage your project workflows</p>
        </div>
        
        <div class="content-placeholder">
          <p class="text-gray-400 text-center">Project management features coming soon...</p>
        </div>
      </div>
    </main>

    <!-- Footer Section -->
    <footer class="footer footer-fixed" role="contentinfo">
      <button @click="backToCollection" class="footer-btn">Collection</button>
      <button @click="viewArchivedTasks" class="footer-btn">ARCHIVE</button>
      
      <button @click="sendMarkedToArchive" class="footer-btn">DONE</button>
    </footer>
  </div>
</template>

<script>
import UniversalBanner from '../components/UniversalBanner.vue';

export default {
  name: 'ProjectView',
  components: {
    UniversalBanner
  },
  mounted() {
    this.$nextTick(() => {
      this.setupParticles();
    });
  },
  methods: {
    setupParticles() {
      try {
        const container = this.$el;
        if (!container) return;
        const particles = container.querySelectorAll('.particles .particle');
        particles.forEach((p) => {
          const dx = (Math.random() * 80 - 40).toFixed(2) + 'px';
          const dy = (Math.random() * 60 - 30).toFixed(2) + 'px';
          const dur = (8 + Math.random() * 12).toFixed(2) + 's';
          const delay = (-Math.random() * 10).toFixed(2) + 's';
          const size = (2 + Math.random() * 10).toFixed(2) + 'px';
          const left = (Math.random() * 100).toFixed(2) + '%';
          const top = (Math.random() * 100).toFixed(2) + '%';

          p.style.setProperty('--dx', dx);
          p.style.setProperty('--dy', dy);
          p.style.setProperty('--dur', dur);
          p.style.setProperty('--delay', delay);
          p.style.left = left;
          p.style.top = top;
          p.style.width = size;
          p.style.height = size;
          p.style.opacity = (0.15 + Math.random() * 0.7).toString();
          p.style.willChange = 'transform, opacity';
        });
      } catch (err) {
        console.warn('setupParticles failed', err);
      }
    },

    viewArchivedTasks() {
      this.$router.push('/archive');
    },

    backToCollection() {
      this.$router.push('/');
    },

    sendMarkedToArchive() {
      this.$router.push('/tasks');
    }
  }
};
</script>

<style scoped>
/* Animated Background */
.animated-bg {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
  overflow: hidden;
}

.particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float var(--delay, 0s) linear infinite;
}

@keyframes float {
  0% { 
    opacity: 0; 
    transform: translateY(0px) translateX(0px) scale(1); 
  }
  25% { 
    opacity: 1; 
    transform: translateY(-15px) translateX(10px) scale(1.1); 
  }
  50% { 
    opacity: 0.8; 
    transform: translateY(-25px) translateX(-5px) scale(0.9); 
  }
  75% { 
    opacity: 1; 
    transform: translateY(-10px) translateX(15px) scale(1.05); 
  }
  100% { 
    opacity: 0; 
    transform: translateY(0px) translateX(0px) scale(1); 
  }
}

.bg-gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
  animation: orbFloat 15s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%);
  top: 60%;
  right: 20%;
  animation-delay: 5s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%);
  bottom: 20%;
  left: 30%;
  animation-delay: 10s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -30px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.9); }
  75% { transform: translate(20px, 10px) scale(1.05); }
}

/* Liquid Glass Components */
.liquid-glass-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 32px;
  margin-top: 120px;
  width: 100%;
  max-width: 780px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50px;
}

.liquid-glass-card:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.main-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-header {
  margin-bottom: 20px;
}

.content-placeholder {
  text-align: center;
  padding: 40px 0;
}

/* Footer */
.footer {
  display: flex;
  justify-content: center;
  gap: 18px;
  padding: 8px 12px;
  align-items: center;
}

.footer-fixed {
  position: fixed;
  left: 50%;
  width: 100%;
  transform: translateX(-50%);
  bottom: 18px;
  z-index: 1200;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 17px 74px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 30px rgba(0,0,0,0.3); 
}

.footer-btn {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.9);
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 600;
}

.footer-btn + .footer-btn {
  margin-left: 8px;
}

.footer-btn:hover {
  background: rgba(255,255,255,0.03);
  color: #fff;
}

/* Responsive Design */
@media (max-width: 768px) {
  .liquid-glass-card {
    padding: 20px;
    margin-top: 100px;
  }
}

@media (max-width: 480px) {
  .liquid-glass-card {
    padding: 20px;
  }
}

/* Custom Scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
}
</style>