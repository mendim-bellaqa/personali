<template>
  <div class="min-h-screen overflow-hidden text-white select-none relative">
    <UniversalBanner />
    
    <!-- Main Container -->

    <!-- Main Container -->
    <div class="relative z-10 w-full max-w-4xl mx-auto pt-32 px-5 pb-20">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-3">
          ARCHIVED TASKS
        </h1>
        <p class="text-gray-300 text-sm">Your completed accomplishments</p>
      </div>

      <!-- Enhanced Archive List Container -->
      <div class="archive-list-container">
        <div
          v-for="(task, index) in archivedTasks"
          :key="task.id"
          class="archive-item liquid-glass-card"
          :class="{ 'completed': task.completed }"
          :style="{ '--animation-delay': (index * 0.1) + 's' }"
        >
          <!-- Archive Item Content with Enhanced Layout -->
          <div class="archive-content">
            <!-- Left Section: Checkbox and Main Info -->
            <div class="archive-main-section">
              <!-- Enhanced Checkbox -->
              <button @click="restoreTask(task.id)" class="archive-checkbox-enhanced">
                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                </svg>
              </button>

              <!-- Task Details -->
              <div class="archive-details">
                <div class="archive-header">
                  <h3 class="archive-title" :class="{ 'completed': task.completed }">
                    {{ task.title }}
                  </h3>
                  <div class="archive-meta-row">
                    <span :class="['archive-plan', `plan-${task.plan}`]">
                      {{ task.plan }}
                    </span>
                    <span class="archive-completed-date">
                      {{ formatCompletionDate(task.completedAt) }}
                    </span>
                  </div>
                </div>
                <p v-if="task.description" class="archive-description" :class="{ 'completed': task.completed }">
                  {{ task.description }}
                </p>
              </div>
            </div>

            <!-- Right Section: Actions -->
            <div class="archive-actions-enhanced">
              <button @click="restoreTask(task.id)" class="archive-action-btn-enhanced restore">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                <span>Restore</span>
              </button>
              <button @click="permanentDeleteTask(task.id)" class="archive-action-btn-enhanced delete">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd" />
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L8.586 12l-1.293 1.293a1 1 0 101.414 1.414L9 13.414l1.293 1.293a1 1 0 001.414-1.414L10.414 12l1.293-1.293z" clip-rule="evenodd" />
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="archivedTasks.length === 0" class="archive-empty-state">
          <div class="archive-empty-icon">
            <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-300 mb-2">No archived tasks</h3>
          <p class="text-gray-400">Completed tasks will appear here.</p>
        </div>
      </div>

      <!-- Footer Controls -->
      <div class="archive-footer-controls" v-if="archivedTasks.length > 0">
        <button @click="restoreAllTasks" class="archive-footer-btn restore-all">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
          Restore All ({{ archivedTasks.length }})
        </button>
        <button @click="clearAllArchived" class="archive-footer-btn clear-all">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd" />
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L8.586 12l-1.293 1.293a1 1 0 101.414 1.414L9 13.414l1.293 1.293a1 1 0 001.414-1.414L10.414 12l1.293-1.293z" clip-rule="evenodd" />
          </svg>
          Clear All
        </button>
      </div>

      <!-- Back to Tasks -->
      <div class="text-center mt-8">
        <router-link to="/tsk" class="archive-back-link">
          ← Back to Tasks
        </router-link>
      </div>
    </div>

    <!-- Confirm Modal -->
    <ConfirmModal
      v-if="showDeleteConfirm"
      title="Delete archived task?"
      message="Are you sure you want to permanently delete this archived task? This cannot be undone."
      @confirm="performPermanentDelete"
      @cancel="cancelPermanentDelete"
    />
  </div>
</template>

<script>
import UniversalBanner from '@/components/UniversalBanner.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
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
  components: { UniversalBanner, ConfirmModal },
  name: 'ArchiveView',
  data() {
    return {
      archivedTasks: [],
      showDeleteConfirm: false,
      pendingDeleteId: null
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
        });
      } catch (error) {
        console.error('Error loading archived tasks:', error);
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

      // show confirmation modal first
      this.pendingDeleteId = taskId;
      this.showDeleteConfirm = true;
    },

    async performPermanentDelete() {
      const id = this.pendingDeleteId;
      this.showDeleteConfirm = false;
      this.pendingDeleteId = null;
      if (!id) return;

      try {
        await deleteDoc(doc(db, 'tasks', id));
        console.log('Task permanently deleted');
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    },

    cancelPermanentDelete() {
      this.pendingDeleteId = null;
      this.showDeleteConfirm = false;
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
}

.liquid-glass-card:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

/* Enhanced Animated Background Elements */
.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02));
  animation: floatElement 15s ease-in-out infinite;
}

.liquid-bubbles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.liquid-bubble {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05));
  animation: bubbleFloat 18s ease-in-out infinite;
}

@keyframes floatElement {
  0%, 100% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
    opacity: 0.3;
  }
  25% {
    transform: translateY(-40px) translateX(25px) rotate(90deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-25px) translateX(-20px) rotate(180deg);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-35px) translateX(30px) rotate(270deg);
    opacity: 0.7;
  }
}

@keyframes bubbleFloat {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.2;
  }
  25% {
    transform: translateY(-50px) scale(1.1);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-30px) scale(0.9);
    opacity: 0.3;
  }
  75% {
    transform: translateY(-45px) scale(1.05);
    opacity: 0.5;
  }
}

/* Archive List Container */
.archive-list-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

/* Enhanced Archive Items */
.archive-item {
  padding: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 0.6s ease-out var(--animation-delay, 0s);
  opacity: 0;
  transform: translateY(30px);
  animation-fill-mode: forwards;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.archive-item.completed {
  opacity: 0.8;
}

.archive-item:hover {
  transform: translateY(-5px) scale(1.01);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Enhanced Archive Content Layout */
.archive-content {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 20px;
}

/* Left Section: Main Info */
.archive-main-section {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

/* Enhanced Archive Checkbox */
.archive-checkbox-enhanced {
  width: 28px;
  height: 28px;
  border: 2px solid rgba(34, 197, 94, 0.4);
  border-radius: 8px;
  background: rgba(34, 197, 94, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 4px;
  position: relative;
  overflow: hidden;
}

.archive-checkbox-enhanced::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.archive-checkbox-enhanced:hover::before {
  left: 100%;
}

.archive-checkbox-enhanced:hover {
  border-color: rgba(34, 197, 94, 0.8);
  background: rgba(34, 197, 94, 0.2);
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
}

/* Enhanced Archive Details */
.archive-details {
  flex: 1;
  min-width: 0;
}

.archive-header {
  margin-bottom: 12px;
}

.archive-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0 0 8px 0;
  line-height: 1.3;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.archive-title.completed {
  text-decoration: line-through;
  opacity: 0.6;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.3));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.archive-meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.archive-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 16px 0;
  line-height: 1.5;
  font-style: italic;
}

.archive-description.completed {
  text-decoration: line-through;
  opacity: 0.5;
}

.archive-plan {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.plan-A {
  background: rgba(34, 197, 94, 0.2);
  color: rgb(134, 239, 172);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.plan-B {
  background: rgba(251, 191, 36, 0.2);
  color: rgb(253, 224, 71);
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.plan-C {
  background: rgba(239, 68, 68, 0.2);
  color: rgb(252, 165, 165);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.archive-completed-date {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
}

/* Right Section: Enhanced Actions */
.archive-actions-enhanced {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
  flex-shrink: 0;
}

/* Enhanced Archive Action Buttons */
.archive-action-btn-enhanced {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 12px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  position: relative;
  overflow: hidden;
  min-width: 100px;
  justify-content: center;
}

.archive-action-btn-enhanced::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.archive-action-btn-enhanced:hover::before {
  left: 100%;
}

.archive-action-btn-enhanced.restore {
  background: rgba(34, 197, 94, 0.15);
  color: rgb(134, 239, 172);
  border: 1px solid rgba(34, 197, 94, 0.3);
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
}

.archive-action-btn-enhanced.restore:hover {
  background: rgba(34, 197, 94, 0.25);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
  border-color: rgba(34, 197, 94, 0.5);
}

.archive-action-btn-enhanced.delete {
  background: rgba(239, 68, 68, 0.15);
  color: rgb(252, 165, 165);
  border: 1px solid rgba(239, 68, 68, 0.3);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
}

.archive-action-btn-enhanced.delete:hover {
  background: rgba(239, 68, 68, 0.25);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.5);
}

/* Empty State */
.archive-empty-state {
  text-align: center;
  padding: 64px 24px;
  opacity: 0.7;
}

.archive-empty-icon {
  margin-bottom: 20px;
  opacity: 0.5;
}

/* Footer Controls */
.archive-footer-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 32px 0;
  flex-wrap: wrap;
}

.archive-footer-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.archive-footer-btn.restore-all {
  background: rgba(34, 197, 94, 0.1);
  color: rgb(134, 239, 172);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.archive-footer-btn.restore-all:hover {
  background: rgba(34, 197, 94, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
}

.archive-footer-btn.clear-all {
  background: rgba(239, 68, 68, 0.1);
  color: rgb(252, 165, 165);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.archive-footer-btn.clear-all:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
}

/* Back to Tasks Link */
.archive-back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
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

.archive-back-link:hover {
  background: rgba(59, 130, 246, 0.15);
  color: rgb(147, 197, 253);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

/* Enhanced Responsive Design */
@media (max-width: 768px) {
  .archive-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .archive-main-section {
    gap: 12px;
  }
  
  .archive-actions-enhanced {
    flex-direction: row;
    justify-content: stretch;
    gap: 8px;
  }
  
  .archive-action-btn-enhanced {
    flex: 1;
    justify-content: center;
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .archive-footer-controls {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  
  .archive-footer-btn {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .archive-item {
    padding: 16px;
  }
  
  .archive-title {
    font-size: 16px;
  }
  
  .archive-description {
    font-size: 13px;
  }
  
  .archive-action-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .archive-footer-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>