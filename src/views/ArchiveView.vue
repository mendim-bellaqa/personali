<template>
  <div class="min-h-screen bg-black overflow-hidden flex items-center justify-center p-4 text-white select-none">
    <!-- Animated Grid Background -->
    <div class="fixed inset-0 z-0 opacity-20">
      <div class="bg-grid-pattern animate-gridMove"></div>
    </div>

    <!-- Main Liquid Glass Container -->
    <div class="relative z-10 flex flex-col w-full max-w-2xl max-w-[95vw] h-[90vh] max-h-[900px] rounded-3xl border border-white/20 border-t-white/30 bg-gradient-to-b from-white/20 to-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden">
      
      <!-- Header -->
      <header class="text-center p-4 sm:p-6 border-b border-white/10 bg-gradient-to-b from-white/10 to-transparent">
        <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">ARCHIVE</h1>
        <p class="mt-1 text-gray-300 text-sm">Completed tasks and memories</p>
      </header>

      <!-- Archive Task List -->
      <div class="flex-grow overflow-hidden">
        <div class="h-full overflow-y-auto p-4 sm:p-6">
          <div class="space-y-3">
            <transition-group name="task" tag="div">
              <div
                v-for="task in archivedTasks"
                :key="task.id"
                class="task-item liquid-glass-card p-3 sm:p-5 rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 group"
              >
                <div class="flex items-start gap-3">
                  <!-- Archive Icon -->
                  <div class="flex-shrink-0 mt-1">
                    <div class="w-4 h-4 sm:w-5 sm:h-5 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <svg class="w-2 h-2 sm:w-3 sm:h-3 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                      </svg>
                    </div>
                  </div>

                  <!-- Task Content -->
                  <div class="flex-grow min-w-0">
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <div class="flex items-center gap-2 flex-wrap">
                        <h3 class="font-semibold text-sm sm:text-lg text-white line-through opacity-75">
                          {{ task.title }}
                        </h3>
                        <span
                          :class="[
                            'px-2 py-1 text-xs rounded-full flex-shrink-0',
                            task.plan === 'A' ? 'bg-green-500/20 text-green-300' :
                            task.plan === 'B' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                          ]"
                        >
                          {{ task.plan }}
                        </span>
                      </div>
                      <span class="text-xs sm:text-sm text-gray-400 flex-shrink-0">{{ formatDate(task.deadline) }}</span>
                    </div>
                    
                    <p v-if="task.description" class="text-xs sm:text-sm mb-3 leading-relaxed text-gray-400 line-through opacity-75">
                      {{ task.description }}
                    </p>

                    <!-- Completed Date -->
                    <div class="text-xs text-purple-300 mb-3">
                      ✅ Completed on {{ formatCompletionDate(task.completedAt) }}
                    </div>

                    <!-- Image Preview -->
                    <div v-if="task.imageUrl" class="mt-3">
                      <img
                        :src="task.imageUrl"
                        class="max-h-20 sm:max-h-32 rounded-lg border border-white/20 opacity-75"
                      />
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-2 flex-shrink-0">
                    <!-- Restore Button -->
                    <button
                      @click="restoreTask(task.id)"
                      class="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                      title="Restore to active tasks"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>

                    <!-- Delete Button -->
                    <button
                      @click="permanentDeleteTask(task.id)"
                      class="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                      title="Permanently delete"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd" />
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L8.586 12l-1.293 1.293a1 1 0 101.414 1.414L9 13.414l1.293 1.293a1 1 0 001.414-1.414L10.414 12l1.293-1.293z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </transition-group>

            <!-- Empty State -->
            <div v-if="archivedTasks.length === 0" class="text-center py-12 sm:py-16">
              <div class="text-gray-400 mb-4">
                <svg class="w-16 h-16 sm:w-20 sm:h-20 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                </svg>
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No archived tasks</h3>
              <p class="text-gray-400 text-sm">Completed tasks will appear here when you archive them.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Controls -->
      <footer class="p-4 border-t border-white/10 bg-gradient-to-t from-white/5 to-transparent">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div class="flex gap-2 sm:gap-3 flex-wrap">
            <button
              v-if="archivedTasks.length > 0"
              @click="restoreAllTasks"
              class="px-3 py-2 liquid-glass text-xs sm:text-sm"
            >
              🔄 Restore All ({{ archivedTasks.length }})
            </button>
            <button
              v-if="archivedTasks.length > 0"
              @click="clearAllArchived"
              class="px-3 py-2 liquid-glass danger text-xs sm:text-sm"
            >
              🗑️ Clear All
            </button>
          </div>
          <router-link to="/tsk" class="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors">
            ← Back to Tasks
          </router-link>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
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
  name: 'ArchiveView',
  data() {
    return {
      archivedTasks: [],
      loading: false
    };
  },
  mounted() {
    this.loadArchivedTasks();
  },
  methods: {
    async loadArchivedTasks() {
      if (!auth.currentUser) {
        console.log('User not authenticated');
        return;
      }

      this.loading = true;
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
          this.loading = false;
        });
      } catch (error) {
        console.error('Error loading archived tasks:', error);
        this.loading = false;
      }
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

/* Liquid Glass Button Styles */
.liquid-glass {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: white;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.liquid-glass::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.liquid-glass:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.liquid-glass:hover::before {
  left: 100%;
}

.liquid-glass.danger {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
}

.liquid-glass.danger:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.5);
}

/* Liquid Glass Card for Tasks */
.liquid-glass-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.liquid-glass-card:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  border: 3px solid transparent;
}

/* Task Animations */
.task-enter-active,
.task-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.task-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.task-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>