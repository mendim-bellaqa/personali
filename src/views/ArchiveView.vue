<template>
  <div class="min-h-screen bg-black overflow-hidden text-white select-none relative">
    <UniversalBanner />
    
    <!-- Animated Background Grid -->
    <div class="fixed inset-0 z-0 opacity-20">
      <div class="bg-grid-pattern animate-gridMove"></div>
    </div>

    <!-- Dynamic Floating Orbs Background -->
    <div class="fixed inset-0 z-0">
      <div 
        v-for="orb in backgroundOrbs" 
        :key="orb.id"
        class="archive-orb"
        :class="orb.class"
        :style="{
          width: orb.size + 'px',
          height: orb.size + 'px',
          top: orb.top + '%',
          left: orb.left + '%',
          animationDelay: orb.delay + 's',
          animationDuration: orb.duration + 's'
        }"
      ></div>
    </div>

    <!-- Main Bubble Map Container -->
    <div class="relative z-10 w-full h-screen flex flex-col">
      <!-- Header -->
      <header class="text-center p-5 pt-20">
        <div class="container mx-auto">
          <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-3">
            ARCHIVE BUBBLES
          </h1>
          <p class="text-gray-300 text-sm">Your completed memories floating in space</p>
        </div>
      </header>

      <!-- Bubble Map Area -->
      <main class="flex-grow relative overflow-hidden">
        <div class="bubble-map-container">
          <div
            v-for="task in animatedArchivedTasks"
            :key="task.id"
            class="archive-bubble liquid-glass-bubble"
            :class="[`bubble-${task.plan.toLowerCase()}`, { 'bubble-active': task.isHovered }]"
            :style="{
              transform: `translate(${task.x}px, ${task.y}px) scale(${task.scale})`,
              width: task.size + 'px',
              height: task.size + 'px',
              animationDuration: task.duration + 's',
              animationDelay: task.delay + 's'
            }"
            @mouseenter="onBubbleHover(task, true)"
            @mouseleave="onBubbleHover(task, false)"
            @click="handleBubbleClick(task)"
          >
            <!-- Bubble Content -->
            <div class="bubble-content">
              <!-- Task Title -->
              <h3 class="bubble-title" :class="{ 'line-through': task.completed }">
                {{ task.title }}
              </h3>
              
              <!-- Plan Badge -->
              <div class="bubble-plan" :class="`plan-${task.plan}`">
                {{ task.plan }}
              </div>
              
              <!-- Completion Date -->
              <div class="bubble-date">
                {{ formatCompletionDate(task.completedAt) }}
              </div>
              
              <!-- Action Icons -->
              <div class="bubble-actions">
                <button 
                  @click.stop="restoreTask(task.id)" 
                  class="bubble-action restore"
                  title="Restore task"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button 
                  @click.stop="permanentDeleteTask(task.id)" 
                  class="bubble-action delete"
                  title="Delete forever"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd" />
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L8.586 12l-1.293 1.293a1 1 0 101.414 1.414L9 13.414l1.293 1.293a1 1 0 001.414-1.414L10.414 12l1.293-1.293z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Bubble Glow Effect -->
            <div class="bubble-glow"></div>
          </div>

          <!-- Empty State when no tasks -->
          <div v-if="archivedTasks.length === 0" class="empty-bubble-state">
            <div class="empty-bubble-icon">
              <svg class="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-300 mb-2">No archived bubbles</h3>
            <p class="text-gray-400 text-sm">Completed tasks will appear here as floating memories.</p>
          </div>
        </div>
      </main>

      <!-- Footer Controls -->
      <footer class="p-5 text-center">
        <div class="container mx-auto">
          <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
            <div class="flex gap-3">
              <button
                v-if="archivedTasks.length > 0"
                @click="restoreAllTasks"
                class="bubble-control restore-all"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                </svg>
                Restore All ({{ archivedTasks.length }})
              </button>
              <button
                v-if="archivedTasks.length > 0"
                @click="clearAllArchived"
                class="bubble-control clear-all"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd" />
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L8.586 12l-1.293 1.293a1 1 0 101.414 1.414L9 13.414l1.293 1.293a1 1 0 001.414-1.414L10.414 12l1.293-1.293z" clip-rule="evenodd" />
                </svg>
                Clear All
              </button>
            </div>
            <router-link to="/tsk" class="bubble-link">
              ← Back to Tasks
            </router-link>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import UniversalBanner from '@/components/UniversalBanner.vue';
import {
  collection,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export default {
  components: { UniversalBanner },
  name: 'ArchiveView',
  data() {
    return {
      archivedTasks: [],
      animatedArchivedTasks: [],
      backgroundOrbs: [
        { id: 1, class: 'orb-a', size: 300, top: 12, left: 6, delay: 0, duration: 20 },
        { id: 2, class: 'orb-b', size: 220, top: 70, left: 75, delay: 5, duration: 26 },
        { id: 3, class: 'orb-c', size: 180, top: 30, left: 85, delay: 10, duration: 18 },
        { id: 4, class: 'orb-d', size: 250, top: 60, left: 15, delay: 15, duration: 22 }
      ],
      animationFrame: null,
      containerBounds: { width: 0, height: 0 }
    };
  },
  mounted() {
    this.loadArchivedTasks();
    this.updateContainerBounds();
    window.addEventListener('resize', this.updateContainerBounds);
    this.startBubbleAnimation();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateContainerBounds);
    this.stopBubbleAnimation();
  },
  methods: {
    async loadArchivedTasks() {
      if (!auth.currentUser) {
        console.log('User not authenticated');
        return;
      }

      try {
        const tasksQuery = query(
          collection(db, 'tasks'),
          where('userId', '==', auth.currentUser.uid),
          where('archived', '==', true),
          orderBy('completedAt', 'desc')
        );

        onSnapshot(tasksQuery, (snapshot) => {
          this.archivedTasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          this.initializeBubbleAnimations();
        });
      } catch (error) {
        console.error('Error loading archived tasks:', error);
      }
    },

    initializeBubbleAnimations() {
      this.animatedArchivedTasks = this.archivedTasks.map((task) => ({
        ...task,
        x: Math.random() * (this.containerBounds.width - 200),
        y: Math.random() * (this.containerBounds.height - 200),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        // keep original velocities to restore after hover
        origVx: null,
        origVy: null,
        scale: 0.8 + Math.random() * 0.4,
        size: 120 + Math.random() * 60,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 5,
        isHovered: false,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2
      }));

      // set origVx/origVy after initial velocities are generated
      this.animatedArchivedTasks.forEach(b => {
        b.origVx = b.vx;
        b.origVy = b.vy;
      });
    },

    startBubbleAnimation() {
      const animate = () => {
        this.animatedArchivedTasks.forEach(bubble => {
          // Update position
          bubble.x += bubble.vx;
          bubble.y += bubble.vy;
          
          // Boundary collision detection
          if (bubble.x <= 0 || bubble.x >= this.containerBounds.width - bubble.size) {
            bubble.vx *= -1;
            bubble.x = Math.max(0, Math.min(bubble.x, this.containerBounds.width - bubble.size));
          }
          if (bubble.y <= 0 || bubble.y >= this.containerBounds.height - bubble.size) {
            bubble.vy *= -1;
            bubble.y = Math.max(0, Math.min(bubble.y, this.containerBounds.height - bubble.size));
          }

          // Random direction changes
          if (Math.random() < 0.01) {
            bubble.vx += (Math.random() - 0.5) * 0.5;
            bubble.vy += (Math.random() - 0.5) * 0.5;
            
            // Limit velocity
            bubble.vx = Math.max(-3, Math.min(3, bubble.vx));
            bubble.vy = Math.max(-3, Math.min(3, bubble.vy));
          }

          // Gentle rotation
          bubble.rotation += bubble.rotationSpeed;
        });

        this.animationFrame = requestAnimationFrame(animate);
      };

      this.animationFrame = requestAnimationFrame(animate);
    },

    stopBubbleAnimation() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    },

    updateContainerBounds() {
      const container = document.querySelector('.bubble-map-container');
      if (container) {
        this.containerBounds = {
          width: container.clientWidth,
          height: container.clientHeight
        };
        this.initializeBubbleAnimations();
      }
    },

    onBubbleHover(task, isHovered) {
      task.isHovered = isHovered;
      if (isHovered) {
        // pause this bubble movement and slightly enlarge
        task.scale = 1.12;
        // store current velocities if not stored
        if (typeof task.origVx !== 'number') task.origVx = task.vx;
        if (typeof task.origVy !== 'number') task.origVy = task.vy;
        task.vx = 0;
        task.vy = 0;
      } else {
        // restore previous velocities and scale
        task.scale = 0.9 + Math.random() * 0.2;
        if (typeof task.origVx === 'number') task.vx = task.origVx;
        if (typeof task.origVy === 'number') task.vy = task.origVy;
      }
    },

    handleBubbleClick(task) {
      // Add a click effect
      task.scale = 1.2;
      setTimeout(() => {
        task.scale = 1;
      }, 200);
    },

    async restoreTask(taskId) {
      if (!auth.currentUser) return;

      try {
        await updateDoc(doc(db, 'tasks', taskId), {
          archived: false,
          updatedAt: serverTimestamp()
        });
        
        console.log('Task restored successfully');
      } catch (error) {
        console.error('Error restoring task:', error);
        alert('Failed to restore task. Please try again.');
      }
    },

    async permanentDeleteTask(taskId) {
      if (!auth.currentUser) return;

      if (!confirm('Are you sure you want to permanently delete this task? This action cannot be undone.')) {
        return;
      }

      try {
        await deleteDoc(doc(db, 'tasks', taskId));
        console.log('Task permanently deleted');
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    },

    async restoreAllTasks() {
      if (!auth.currentUser) return;

      if (!confirm(`Are you sure you want to restore all ${this.archivedTasks.length} archived tasks?`)) {
        return;
      }

      try {
        const batch = writeBatch(db);
        
        this.archivedTasks.forEach(task => {
          const taskRef = doc(db, 'tasks', task.id);
          batch.update(taskRef, {
            archived: false,
            updatedAt: serverTimestamp()
          });
        });

        await batch.commit();
        
        console.log('All tasks restored successfully');
      } catch (error) {
        console.error('Error restoring all tasks:', error);
        alert('Failed to restore all tasks. Please try again.');
      }
    },

    async clearAllArchived() {
      if (!auth.currentUser) return;

      if (!confirm(`Are you sure you want to permanently delete all ${this.archivedTasks.length} archived tasks? This action cannot be undone.`)) {
        return;
      }

      try {
        const batch = writeBatch(db);
        
        this.archivedTasks.forEach(task => {
          const taskRef = doc(db, 'tasks', task.id);
          batch.delete(taskRef);
        });

        await batch.commit();
        
        console.log('All archived tasks permanently deleted');
      } catch (error) {
        console.error('Error clearing archive:', error);
        alert('Failed to clear archive. Please try again.');
      }
    },

    formatDate(deadline) {
      if (!deadline) return 'No deadline';
      
      const date = new Date(deadline);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },

    formatCompletionDate(completedAt) {
      if (!completedAt) return 'Unknown';
      
      const date = completedAt.toDate ? completedAt.toDate() : new Date(completedAt);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
/* Grid pattern and animation styles */
.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 2px, transparent 2px);
  background-size: 60px 60px;
}

@keyframes gridMove {
  0% { background-position: 0 0; }
  100% { background-position: 60px 60px; }
}

.animate-gridMove {
  animation: gridMove 30s linear infinite;
}

/* Dynamic Background Orbs */
.archive-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(36px);
  opacity: 0.12;
  pointer-events: none;
  animation: orbFloat 20s ease-in-out infinite;
}

.orb-a { 
  background: radial-gradient(circle, rgba(99,102,241,0.6), transparent); 
}

.orb-b { 
  background: radial-gradient(circle, rgba(236,72,153,0.5), transparent); 
  animation-direction: reverse;
}

.orb-c { 
  background: radial-gradient(circle, rgba(34,197,94,0.4), transparent); 
}

.orb-d { 
  background: radial-gradient(circle, rgba(251,191,36,0.5), transparent); 
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  25% { transform: translate(30px, -30px) scale(1.1) rotate(90deg); }
  50% { transform: translate(-20px, 20px) scale(0.9) rotate(180deg); }
  75% { transform: translate(20px, 10px) scale(1.05) rotate(270deg); }
}

/* Bubble Map Container */
.bubble-map-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Archive Bubbles */
.archive-bubble {
  position: absolute;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: bubbleFloat 15s ease-in-out infinite;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  z-index: 10;
}

.archive-bubble:hover {
  z-index: 20;
  filter: brightness(1.1);
}

.liquid-glass-bubble {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 8px 32px rgba(0, 0, 0, 0.3);
}

.liquid-glass-bubble:hover {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 12px 40px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(255, 255, 255, 0.1);
}

.bubble-active {
  transform: scale(1.15) !important;
  z-index: 30;
}

/* Bubble Content */
.bubble-content {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 2;
}

.bubble-title {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
  line-height: 1.2;
  max-width: 90%;
  word-wrap: break-word;
}

.bubble-title.line-through {
  text-decoration: line-through;
  opacity: 0.7;
}

.bubble-plan {
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 12px;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.plan-a {
  background: rgba(34, 197, 94, 0.2);
  color: rgb(134, 239, 172);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.plan-b {
  background: rgba(251, 191, 36, 0.2);
  color: rgb(253, 224, 71);
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.plan-c {
  background: rgba(239, 68, 68, 0.2);
  color: rgb(252, 165, 165);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.bubble-date {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
}

.bubble-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.archive-bubble:hover .bubble-actions {
  opacity: 1;
}

.bubble-action {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.bubble-action.restore {
  background: rgba(34, 197, 94, 0.2);
  color: rgb(134, 239, 172);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.bubble-action.delete {
  background: rgba(239, 68, 68, 0.2);
  color: rgb(252, 165, 165);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.bubble-action:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.2);
}

/* Bubble Glow Effect */
.bubble-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent 50%);
  animation: bubbleGlow 4s ease-in-out infinite alternate;
  z-index: 1;
}

@keyframes bubbleGlow {
  0% { opacity: 0.3; }
  100% { opacity: 0.6; }
}

@keyframes bubbleFloat {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
  }
  25% { 
    transform: translateY(-10px) rotate(1deg);
  }
  50% { 
    transform: translateY(-5px) rotate(-0.5deg);
  }
  75% { 
    transform: translateY(-8px) rotate(0.8deg);
  }
}

/* Empty State */
.empty-bubble-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 5;
}

.empty-bubble-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

/* Footer Controls */
.bubble-control {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.bubble-control.restore-all {
  background: rgba(34, 197, 94, 0.1);
  color: rgb(134, 239, 172);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.bubble-control.restore-all:hover {
  background: rgba(34, 197, 94, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.2);
}

.bubble-control.clear-all {
  background: rgba(239, 68, 68, 0.1);
  color: rgb(252, 165, 165);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.bubble-control.clear-all:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.2);
}

.bubble-link {
  padding: 10px 16px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  color: rgb(96, 165, 250);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(15px);
}

.bubble-link:hover {
  background: rgba(59, 130, 246, 0.15);
  color: rgb(147, 197, 253);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

/* Mobile Optimizations */
@media (max-width: 768px) {
  .bubble-content {
    padding: 12px;
  }
  
  .bubble-title {
    font-size: 12px;
  }
  
  .bubble-plan {
    font-size: 9px;
    padding: 3px 6px;
  }
  
  .bubble-date {
    font-size: 9px;
  }
  
  .bubble-action {
    width: 20px;
    height: 20px;
  }
  
  .archive-bubble {
    min-width: 100px;
    min-height: 100px;
  }
}

@media (max-width: 480px) {
  .bubble-content {
    padding: 8px;
  }
  
  .bubble-title {
    font-size: 11px;
  }
  
  .archive-bubble {
    min-width: 90px;
    min-height: 90px;
  }
  
  .bubble-control {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>