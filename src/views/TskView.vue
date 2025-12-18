<template>
  <div class="min-h-screen bg-transparent overflow-hidden flex items-center justify-center p-5 text-white select-none relative">
    <!-- Universal Banner -->
    <UniversalBanner />
    
  <!-- Main Content Container -->
  <main class="relative z-10 w-full max-w-4xl mx-auto main-center">
      <!-- Task Form Container -->
      <div class="task-form-container liquid-glass-card">
        <!-- Form Header -->
        <div class="form-header">
          <h2 class="text-2xl font-bold text-white mb-3">Add New Task</h2>
          <p class="text-gray-300 text-sm">Organize your day efficiently</p>
        </div>

        <!-- Task Form -->
        <form @submit.prevent="addTask" class="task-form">
          <!-- Task Title (full width) -->
          <div class="form-row">
            <div class="input-group full-width">
              <input
                type="text"
                v-model="form.title"
                placeholder="What's on your mind?"
                class="form-input liquid-glass-input"
              />
            </div>
          </div>

          <!-- Description (full width) -->
          <div class="form-row">
            <div class="input-group full-width">
              <textarea
                v-model="form.description"
                placeholder="Additional details..."
                rows="2"
                class="form-input liquid-glass-input resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Plan (full width) -->
          <div class="form-row">
            <div class="input-group full-width">
              <select v-model="form.plan" class="form-select liquid-glass-input">
                <option value="A">Plan A</option>
                <option value="B">Plan B</option>
                <option value="C">Plan C</option>
              </select>
            </div>
          </div>

          <!-- Deadline (full width) -->
          <div class="form-row">
            <div class="input-group full-width">
              <div class="date-wrapper">
                <input
                  type="date"
                  v-model="form.deadline"
                  class="form-input liquid-glass-input"
                />
                <span v-if="!form.deadline" class="date-placeholder">Due Date</span>
              </div>
            </div>
          </div>

          <!-- Add Button (full width) -->
          <div class="form-row">
            <div class="input-group full-width">
              <button
                type="submit"
                :disabled="!form.title.trim()"
                class="add-button liquid-glass-button full-width"
                :class="{ 'disabled': !form.title.trim() }"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Task List -->
      <div class="task-list-container">
        <div class="task-list-header">
          <h3 class="text-xl font-semibold text-white">
            <span class="tasks-text-bold">Tasks</span>
          </h3>
          <div class="task-count">{{ tasks.length }} tasks</div>
        </div>

        <!-- Tasks -->
        <div class="task-list">
          <transition-group name="task" tag="div">
            <div
              v-for="(task, index) in tasks"
              :key="task.id"
              :draggable="true"
              @dragstart="onDragStart($event, index)"
              @dragover.prevent
              @drop="onDrop($event, index)"
              @dragend="onDragEnd"
              class="task-item liquid-glass-card"
              :class="[{ 'completed': task.completed, 'dragging': isDragging }, getTaskClasses(task)]"
            >
              <!-- Task Content -->
              <div class="task-content">
                <!-- Checkbox -->
                <button @click="toggleTask(task)" class="task-checkbox">
                  <svg v-if="task.completed" class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </button>

                <!-- Task Details -->
                <div class="task-details">
                  <div class="task-header">
                    <h4 :class="['task-title', { 'completed': task.completed }]" @click="toggleExpand(task.id)">
                      {{ isExpanded(task.id) ? task.title : truncateTitle(task.title) }}
                      <span v-if="task.title.length > 15 && !isExpanded(task.id)" class="text-xs text-blue-300 ml-1">(more)</span>
                    </h4>
                    <div class="task-meta">
                      <span :class="['task-plan', `plan-${task.plan}`]">
                        {{ task.plan }}
                      </span>
                      <span class="task-deadline">{{ formatDate(task.deadline) }}</span>
                    </div>
                  </div>
                  <p v-if="task.description" :class="['task-description', { 'completed': task.completed }]">
                    {{ task.description }}
                  </p>
                </div>

                <!-- Task Actions -->
                <div class="task-actions">
                  <button @click="editTask(task)" class="task-action-btn">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                    </svg>
                  </button>
                  <button @click="archiveTask(task.id)" class="task-action-btn text-yellow-400">
                    <span class="archive-icon-text">A</span>
                  </button>
                  <button @click="deleteTask(task.id)" class="task-action-btn text-red-400">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd" />
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L8.586 12l-1.293 1.293a1 1 0 101.414 1.414L9 13.414l1.293 1.293a1 1 0 001.414-1.414L10.414 12l1.293-1.293z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <!-- Mining Points Button - Moved Below Actions as Requested -->
              <div class="mining-points-container">
                <button @click="incrementMiningPoints(task)" class="mining-btn-liquid-glass">
                  <span class="mining-points">{{ task.miningPoints || 0 }}</span>
                  <svg class="mining-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </transition-group>

          <!-- Empty State -->
          <div v-if="tasks.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-300 mb-2">No tasks yet</h3>
            <p class="text-gray-400">Create your first task to get started!</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Edit Task Modal -->
    <div v-if="editingTask" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="modal-content liquid-glass-card max-w-md w-full">
        <div class="modal-header">
          <h3 class="text-xl font-bold text-white">Edit Task</h3>
        </div>
        <form @submit.prevent="saveTaskEdit" class="modal-form">
          <div class="form-group">
            <input
              v-model="editingTask.title"
              type="text"
              placeholder="Task title"
              class="form-input liquid-glass-input"
            />
          </div>
          <div class="form-group">
            <textarea
              v-model="editingTask.description"
              placeholder="Description"
              rows="3"
              class="form-input liquid-glass-input resize-none"
            ></textarea>
          </div>
          <div class="form-row">
            <select
              v-model="editingTask.plan"
              class="form-select liquid-glass-input flex-1"
            >
              <option value="A">Plan A</option>
              <option value="B">Plan B</option>
              <option value="C">Plan C</option>
            </select>
            <input
              v-model="editingTask.deadline"
              type="date"
              class="form-input liquid-glass-input flex-1"
            />
          </div>
          <div class="modal-actions">
            <button type="button" @click="cancelEdit" class="btn-secondary">Cancel</button>
            <button type="button" @click="archiveTaskFromEdit" class="btn-archive">Archive this work</button>
            <button type="submit" class="btn-primary liquid-glass-button">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <ConfirmModal
      v-if="showDeleteConfirm"
      title="Delete task?"
      message="Are you sure you want to permanently delete this task? This action cannot be undone."
      @confirm="performDelete"
      @cancel="cancelDelete"
    />

    <!-- Footer Section -->
    <footer class="footer-container" role="contentinfo">
      <div class="footer-content">
        <button @click="backToCollection" class="footer-btn">Collection</button>
        <button @click="viewArchivedTasks" class="footer-btn">ARCHIVE</button>
         
        <button @click="sendMarkedToArchive" class="footer-btn">DONE</button>
      </div>
    </footer>
  </div>
</template>

<script>
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import UniversalBanner from '../components/UniversalBanner.vue';
import ConfirmModal from '../components/ConfirmModal.vue';

export default {
  name: 'TskView',
  components: {
    UniversalBanner
    , ConfirmModal
  },
  data() {
    return {
      tasks: [],
      isDragging: false,
      dragIndex: null,
      editingTask: null,
      form: {
        title: '',
        plan: 'A',
        description: '',
        deadline: ''
      }
      , showDeleteConfirm: false,
      pendingDeleteId: null,
      expandedTaskIds: []
    };
  },
  mounted() {
    this.loadTasks();
    // initialize decorative particles for smooth independent motion
    this.$nextTick(() => {
      // Particles removed
    });
  },
  methods: {
    loadTasks() {
      if (!auth.currentUser) return;

      // Simplified query without composite index requirements
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('userId', '==', auth.currentUser.uid)
      );

      onSnapshot(tasksQuery, (snapshot) => {
        this.tasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(task => !task.archived)
        .sort((a, b) => {
          return (a.order || 0) - (b.order || 0);
        });
      });
    },

    async addTask() {
      try {
        if (!this.form.title.trim()) {
          throw new Error('Task title cannot be empty');
        }

        // New tasks go to the TOP (min order - 1)
        const nextOrder = this.tasks.length > 0 ? Math.min(...this.tasks.map(t => t.order || 0)) - 1 : 0;

        const newTask = {
          title: this.form.title,
          description: this.form.description,
          plan: this.form.plan,
          deadline: this.form.deadline || null,
          completed: false,
          archived: false,
          order: nextOrder,
          miningPoints: 0,
          userId: auth.currentUser.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        };

  const docRef = await addDoc(collection(db, 'tasks'), newTask);
  console.log('Task added with ID:', docRef.id);
  // Do NOT push the new task locally here — the onSnapshot listener will update the UI.

        // Clear form
        this.form.title = '';
        this.form.description = '';
        this.form.plan = 'A';
        this.form.deadline = '';
      } catch (error) {
        console.error('Error adding task:', error);
        alert('Failed to add task. Please try again.');
      }
    },

    async toggleTask(task) {
      try {
        await updateDoc(doc(db, 'tasks', task.id), {
          completed: !task.completed,
          updatedAt: serverTimestamp(),
          ...(task.completed ? {} : { completedAt: serverTimestamp() })
        });
      } catch (error) {
        console.error('Error updating task:', error);
      }
    },

    // show confirm modal first, then delete on confirm
    deleteTask(taskId) {
      this.pendingDeleteId = taskId;
      this.showDeleteConfirm = true;
    },

    async performDelete() {
      const taskId = this.pendingDeleteId;
      this.showDeleteConfirm = false;
      this.pendingDeleteId = null;
      if (!taskId) return;

      try {
        await deleteDoc(doc(db, 'tasks', taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. See console for details.');
      }
    },

    async archiveTask(taskId) {
      try {
        await updateDoc(doc(db, 'tasks', taskId), {
          archived: true,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        console.error('Error archiving task:', error);
        alert('Failed to archive task. Please try again.');
      }
    },

    cancelDelete() {
      this.pendingDeleteId = null;
      this.showDeleteConfirm = false;
    },

    editTask(task) {
      this.editingTask = { ...task };
    },

    async saveTaskEdit() {
      if (!this.editingTask) return;

      try {
        await updateDoc(doc(db, 'tasks', this.editingTask.id), {
          title: this.editingTask.title.trim(),
          description: this.editingTask.description,
          plan: this.editingTask.plan,
          deadline: this.editingTask.deadline || null,
          miningPoints: this.editingTask.miningPoints || 0,
          updatedAt: serverTimestamp()
        });

        this.editingTask = null;
      } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task. Please try again.');
      }
    },

    cancelEdit() {
      this.editingTask = null;
    },

    formatDate(deadline) {
      if (!deadline) return 'No deadline';
      
      const date = new Date(deadline);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    },

    // Drag & Drop Methods
    onDragStart(e, index) {
      this.dragIndex = index;
      this.isDragging = true;
    },

    onDrop(e, dropIndex) {
      if (this.dragIndex === null || this.dragIndex === dropIndex) {
        return;
      }

      // Store the dragged task temporarily
      const draggedTask = this.tasks[this.dragIndex];
      
      // Remove the dragged task from its original position
      this.tasks.splice(this.dragIndex, 1);
      
      // Insert the dragged task at the new position
      this.tasks.splice(dropIndex, 0, draggedTask);
      
      // Update the dragIndex to the new position for proper cleanup
      this.dragIndex = dropIndex;
      
      // Save the new order to database after successful drop
      this.updateTaskOrders();
    },

    onDragEnd() {
      this.isDragging = false;
      this.dragIndex = null;
    },

    async updateTaskOrders() {
      try {
        const updatePromises = this.tasks.map((task, index) =>
          updateDoc(doc(db, 'tasks', task.id), {
            order: index,
            updatedAt: serverTimestamp()
          })
        );
        await Promise.all(updatePromises);
      } catch (error) {
        console.error('Error updating task orders:', error);
      }
    },

    sendMarkedToArchive() {
      // Archive all tasks that are marked (we'll treat `completed === true` as marked)
      if (!auth.currentUser) return;

      const marked = this.tasks.filter(t => t.completed && !t.archived);
      if (marked.length === 0) {
        alert('No marked tasks to archive. Mark tasks (check them) first.');
        return;
      }

      if (!confirm(`Send ${marked.length} marked task(s) to archive?`)) return;

      const promises = marked.map(t => updateDoc(doc(db, 'tasks', t.id), {
        archived: true,
        updatedAt: serverTimestamp()
      }));

      Promise.all(promises)
        .then(() => {
          // UI will update via onSnapshot; show a small notice
          console.log('Marked tasks archived');
        })
        .catch(err => {
          console.error('Failed to archive marked tasks', err);
          alert('Failed to archive marked tasks. See console for details.');
        });
    },



    viewArchivedTasks() {
      this.$router.push('/archive');
    },

    backToCollection() {
      this.$router.push('/');
    },

    async incrementMiningPoints(task) {
      try {
        const newPoints = (task.miningPoints || 0) + 1;
        await updateDoc(doc(db, 'tasks', task.id), {
          miningPoints: newPoints,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        console.error('Error updating mining points:', error);
      }
    },

    async archiveTaskFromEdit() {
      if (!this.editingTask) return;
      
      const confirmed = confirm('Are you sure you want to archive this task? It will be moved to the archive.');
      if (!confirmed) return;
      
      try {
        await updateDoc(doc(db, 'tasks', this.editingTask.id), {
          archived: true,
          updatedAt: serverTimestamp()
        });
        this.editingTask = null;
      } catch (error) {
        console.error('Error archiving task:', error);
        alert('Failed to archive task. Please try again.');
      }
    },

    // UI Helpers
    truncateTitle(title) {
      if (!title) return '';
      if (title.length <= 15) return title;
      return title.substring(0, 15) + '...';
    },

    toggleExpand(taskId) {
      if (this.expandedTaskIds.includes(taskId)) {
        this.expandedTaskIds = this.expandedTaskIds.filter(id => id !== taskId);
      } else {
        this.expandedTaskIds.push(taskId);
      }
    },

    isExpanded(taskId) {
      return this.expandedTaskIds.includes(taskId);
    },

    getTaskClasses(task) {
      if (task.completed) return '';
      if (!task.deadline) return '';
      
      const now = new Date();
      // Reset time portion for accurate day calculation
      now.setHours(0, 0, 0, 0);
      const deadline = new Date(task.deadline);
      // deadline string comes as YYYY-MM-DD, parsing it as UTC often shifts it. 
      // Let's create a local date from the input value string to be safe, or just rely on standard parsing if it matches user locale.
      // Usually input type="date" value is YYYY-MM-DD. 
      // To strictly match "Today", we need to be careful.
      // Let's use simple millisecond diff for rough approximation or re-use formatDate logic.
      
      // Let's treat deadline string as midnight of that day in local time
      const [year, month, day] = task.deadline.split('-').map(Number);
      const deadlineDate = new Date(year, month - 1, day);
      
      const diffTime = deadlineDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // ceil because same day is 0

      if (diffDays < 0) return 'task-overdue';
      if (diffDays === 0) return 'task-urgent'; // Today
      if (diffDays <= 3) return 'task-warning'; // Upcoming
      return '';
    }
  }
};
</script>

<style scoped>
/* Animated Background */
/* Animated Background Removed */

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

.particle:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
.particle:nth-child(2) { top: 80%; left: 20%; animation-delay: 2s; }
.particle:nth-child(3) { top: 60%; left: 80%; animation-delay: 4s; }
.particle:nth-child(4) { top: 30%; left: 70%; animation-delay: 1s; }
.particle:nth-child(5) { top: 70%; left: 50%; animation-delay: 3s; }
.particle:nth-child(6) { top: 40%; left: 30%; animation-delay: 5s; }
.particle:nth-child(7) { top: 90%; left: 60%; animation-delay: 6s; }
.particle:nth-child(8) { top: 10%; left: 40%; animation-delay: 7s; }
.particle:nth-child(9) { top: 50%; left: 90%; animation-delay: 8s; }
.particle:nth-child(10) { top: 25%; left: 85%; animation-delay: 9s; }

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

/* Logo Animation */
.logo-container {
  animation: logoGlow 3s ease-in-out infinite;
}

.shine-animation {
  position: relative;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes logoGlow {
  0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5)); }
  50% { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8)); }
}

/* Profile Dropdown */
.profile-dropdown {
  position: relative;
}

.profile-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.profile-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.profile-avatar {
  display: flex;
  align-items: center;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
}

.dropdown-arrow.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  min-width: 180px;
  border-radius: 12px;
  padding: 8px 0;
  z-index: 50;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 12px 16px;
  color: white;
  text-decoration: none;
  transition: background-color 0.2s ease;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
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

/* Dynamic Deadline Classes */
.task-overdue {
  background: rgba(239, 68, 68, 0.25) !important; /* Red-500 */
  border-color: rgba(239, 68, 68, 0.4) !important;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
}

.task-urgent {
  background: rgba(248, 113, 113, 0.2) !important; /* Red-400 */
  border-color: rgba(248, 113, 113, 0.35) !important;
}

.task-warning {
  background: rgba(251, 191, 36, 0.15) !important; /* Amber-400 */
  border-color: rgba(251, 191, 36, 0.3) !important;
}

.liquid-glass-card:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.liquid-glass-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.liquid-glass-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.liquid-glass-input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: rgba(255, 255, 255, 0.15);
}

.liquid-glass-button {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  padding: 12px 20px;
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.liquid-glass-button:hover:not(.disabled) {
  background: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.5);
  transform: translateY(-1px);
}

.liquid-glass-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Layout Components */
.task-form-container {
  margin-bottom: 32px;
  padding: 32px;
  /* add more space from the fixed header/banner */
  margin-top: 120px;
}

/* Keep form & list centered and constrained */
.main-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.task-form-container,
.task-list-container {
  width: 100%;
  max-width: 780px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50px;
}

.form-header {
  margin-bottom: 20px;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.form-row:last-child {
  align-items: stretch;
}

.input-group,
.select-group,
.form-group {
  flex: 1;
}

.form-input,
.form-select {
  width: 100%;
  height: 44px;
  font-size: 14px;
}

.full-width { width: 100%; }

.form-row-split { display: flex; gap: 12px; align-items: flex-end; }
.split-half { width: 50%; box-sizing: border-box; }

/* date wrapper and placeholder */
.date-wrapper { position: relative; }
.date-placeholder {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  color: rgba(255,255,255,0.6);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.6px;
}
.date-input { text-align: center; }
.add-button.full-width { width: 100%; justify-content: center; }

.form-input.large {
  height: auto;
  min-height: 44px;
  padding: 12px 16px;
}

.add-button {
  padding: 12px 20px;
  white-space: nowrap;
  font-weight: 500;
}

/* Task List */
.task-list-container {
  margin-top: 40px;
  margin-bottom: 50px;
}

.task-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.task-count {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.tasks-text-bold {
  font-weight: 800;
  margin-bottom: 10px;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
  text-decoration-color: rgba(59, 130, 246, 0.6);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 50px;
}

.task-item {
  padding: 16px;
  transition: all 0.3s ease;
  margin-bottom: 50px;
}

.task-item.completed {
  opacity: 0.7;
}

.task-item.dragging {
  opacity: 0.6;
  transform: rotate(2deg);
}

.task-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.task-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
}

.task-checkbox:hover {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.1);
}

.task-details {
  flex: 1;
  min-width: 0;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.task-title {
  font-weight: 500;
  color: white;
  margin: 0;
  font-size: 16px;
  cursor: pointer;
}

.task-title.completed {
  text-decoration: line-through;
  color: rgba(255, 255, 255, 0.5);
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.task-plan {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.plan-A {
  background: rgba(34, 197, 94, 0.2);
  color: rgb(134, 239, 172);
}

.plan-B {
  background: rgba(120, 120, 120, 0.2);
  color: rgb(200, 200, 200);
}

.plan-C {
  background: rgba(120, 120, 120, 0.2);
  color: rgb(200, 200, 200);
}

.task-deadline {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
}

/* Mining Points Button */
.mining-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 16px;
  color: rgb(134, 239, 172);
  transition: all 0.3s ease;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
}

.mining-btn:hover {
  background: rgba(16, 185, 129, 0.25);
  border-color: rgba(16, 185, 129, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.mining-points {
  font-weight: 700;
  min-width: 8px;
  text-align: center;
}

.mining-icon {
  width: 12px;
  height: 12px;
  transition: transform 0.2s ease;
}

.mining-btn:hover .mining-icon {
  transform: scale(1.1);
}

/* Mining Points Button Container - New Position Below Actions */
.mining-points-container {
  margin-top: 12px;
  padding: 0 16px 16px 16px;
  display: flex;
  justify-content: center;
}

/* Enhanced Liquid Glass Mining Button */
.mining-btn-liquid-glass {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 16px;
  color: rgb(134, 239, 172);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  position: relative;
  overflow: hidden;
  font-weight: 600;
  font-size: 14px;
  box-shadow:
    0 4px 15px rgba(16, 185, 129, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: float 3s ease-in-out infinite;
}

.mining-btn-liquid-glass::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.mining-btn-liquid-glass:hover::before {
  left: 100%;
}

.mining-btn-liquid-glass:hover {
  background: rgba(16, 185, 129, 0.25);
  border-color: rgba(16, 185, 129, 0.5);
  transform: translateY(-2px) scale(1.05);
  box-shadow:
    0 8px 25px rgba(16, 185, 129, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.mining-btn-liquid-glass .mining-points {
  font-size: 16px;
  font-weight: 700;
  min-width: 20px;
  text-align: center;
}

.mining-btn-liquid-glass .mining-icon {
  width: 18px;
  height: 18px;
  opacity: 0.8;
  transition: transform 0.2s ease;
}

.mining-btn-liquid-glass:hover .mining-icon {
  transform: scale(1.1);
}

/* Archive Icon Text */
.archive-icon-text {
  font-size: 14px;
  font-weight: bold;
  color: #fbbf24;
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
}

.task-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
}

.task-description.completed {
  text-decoration: line-through;
  color: rgba(255, 255, 255, 0.4);
}

.task-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.task-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
}

.task-action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px 24px;
}

.empty-icon {
  margin-bottom: 16px;
}

/* Modal */
.modal-content {
  padding: 24px;
  max-width: 480px;
  width: 100%;
}

.modal-header {
  margin-bottom: 20px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-form .form-row {
  gap: 12px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-secondary {
  padding: 12px 20px;
  background: rgba(107, 114, 128, 0.2);
  border: 1px solid rgba(107, 114, 128, 0.3);
  border-radius: 12px;
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-secondary:hover {
  background: rgba(107, 114, 128, 0.3);
  border-color: rgba(107, 114, 128, 0.4);
}

.btn-archive {
  padding: 12px 20px;
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 12px;
  color: #fbbf24;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-archive:hover {
  background: rgba(245, 158, 11, 0.3);
  border-color: rgba(245, 158, 11, 0.5);
  transform: translateY(-1px);
}

/* Animations */
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

/* Footer */
.footer-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1200;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    0 -10px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 20px rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.footer-content {
  display: flex;
  justify-content: center;
  gap: 18px;
  padding: 20px 12px;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
}

.footer-container:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow:
    0 -15px 50px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 0 30px rgba(255, 255, 255, 0.1);
}

.footer-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255,255,255,0.9);
  cursor: pointer;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.footer-btn + .footer-btn {
  margin-left: 12px;
}

.footer-btn:hover {
  background: rgba(255,255,255,0.15);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Add bottom padding to main content to account for fixed footer */
.main-center {
  padding-bottom: 100px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .task-form-container {
    padding: 20px;
    margin-top: 100px;
  }
  .form-row {
    flex-direction: column;
    gap: 10px;
  }

  .form-input,
  .form-select {
    width: 100%;
    padding-top: 12px;
    text-align: left;
    margin-left: 0;
  }

  /* Keep Plan and Date on same row with equal width on mobile */
  .form-row-split {
    flex-direction: row;
    gap: 8px;
  }
  .plan-field {
    width: 50%;
    box-sizing: border-box;
  }
  .date-field {
    width: 50%;
    box-sizing: border-box;
  }

  /* Improve date button display */
  .date-wrapper {
    position: relative;
    height: 44px;
  }
  
  .date-wrapper input[type="date"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
    color: white;
    font-size: 14px;
    cursor: pointer;
  }

  /* Show selected date or placeholder */
  .date-wrapper input[type="date"]:not(:placeholder-shown) {
    color: white;
  }

  .date-wrapper input[type="date"]::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    filter: invert(1);
  }

  .task-list-container {
    padding: 0 10px;
    margin-bottom: 50px;
  }
}

@media (max-width: 480px) {
  .task-form-container {
    padding: 20px;
  }
  
  /* Even smaller spacing for very small screens */
  .form-row-split {
    gap: 6px;
  }
  
  .task-item {
    padding: 16px;
    margin-bottom: 20px; /* More space between cards on mobile */
  }
  
  .form-header h2 {
    font-size: 20px;
  }
  
  .logo-container h1 {
    font-size: 24px;
  }

  /* Ensure date input is properly sized on very small screens */
  .date-wrapper input[type="date"] {
    font-size: 13px;
    padding-right: 24px; /* Make room for the calendar icon */
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