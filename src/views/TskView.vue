<template>
  <div class="min-h-screen bg-black overflow-hidden flex items-center justify-center p-4 text-white select-none relative">
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

  <!-- Main Content Container -->
  <main class="relative z-10 w-full max-w-4xl mx-auto main-center">
      <!-- Task Form Container -->
      <div class="task-form-container liquid-glass-card">
        <!-- Form Header -->
        <div class="form-header">
          <h2 class="text-2xl font-bold text-white mb-2">Add New Task</h2>
          <p class="text-gray-300 text-sm">Organize your day efficiently</p>
        </div>

        <!-- Task Form -->
        <form @submit.prevent="addTask" class="task-form">
          <!-- Task Title Row -->
          <div class="form-row">
            <div class="input-group">
              <input
                type="text"
                v-model="form.title"
                placeholder="What's on your mind?"
                class="form-input liquid-glass-input"
              />
            </div>
            <div class="select-group">
              <select v-model="form.plan" class="form-select liquid-glass-input">
                <option value="A">Plan A</option>
                <option value="B">Plan B</option>
                <option value="C">Plan C</option>
              </select>
            </div>
          </div>

          <!-- Description -->
          <div class="form-row">
            <textarea
              v-model="form.description"
              placeholder="Additional details..."
              rows="2"
              class="form-input liquid-glass-input resize-none"
            ></textarea>
          </div>

          <!-- Deadline and Action Row -->
          <div class="form-row">
            <input
              type="date"
              v-model="form.deadline"
              class="form-input liquid-glass-input"
            />
            <button
              type="submit"
              :disabled="!form.title.trim()"
              class="add-button liquid-glass-button"
              :class="{ 'disabled': !form.title.trim() }"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Add Task</span>
            </button>
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
              :class="{ 'completed': task.completed, 'dragging': isDragging }"
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
                    <h4 :class="['task-title', { 'completed': task.completed }]">
                      {{ task.title }}
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
                  <button @click="deleteTask(task.id)" class="task-action-btn text-red-400">
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
            <button type="submit" class="btn-primary liquid-glass-button">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Footer Section -->
    <footer class="footer footer-fixed" role="contentinfo">
      <button @click="sendMarkedToArchive" class="footer-btn">Sent market to archived</button>
      <button @click="viewArchivedTasks" class="footer-btn">View archived tasks</button>
      <button @click="backToCollection" class="footer-btn">Back to collection</button>
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

export default {
  name: 'TskView',
  components: {
    UniversalBanner
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
    };
  },
  mounted() {
    this.loadTasks();
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
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      });
    },

    async addTask() {
      try {
        if (!this.form.title.trim()) {
          throw new Error('Task title cannot be empty');
        }

        // Get the next order value for this user
        const nextOrder = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.order || 0)) + 1 : 0;

        const newTask = {
          title: this.form.title,
          description: this.form.description,
          plan: this.form.plan,
          deadline: this.form.deadline || null,
          completed: false,
          archived: false,
          order: nextOrder,
          userId: auth.currentUser.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const docRef = await addDoc(collection(db, 'tasks'), newTask);
        console.log('Task added with ID:', docRef.id);

        // Add task with transition effect
        this.tasks = [...this.tasks, { id: docRef.id, ...newTask }];

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

    async deleteTask(taskId) {
      try {
        await deleteDoc(doc(db, 'tasks', taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
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

      const draggedTask = this.tasks[this.dragIndex];
      this.tasks.splice(this.dragIndex, 1);
      this.tasks.splice(dropIndex, 0, draggedTask);
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
  0%, 100% { opacity: 0; transform: translateY(0px); }
  50% { opacity: 1; transform: translateY(-20px); }
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
  padding: 24px;
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
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
  text-decoration-color: rgba(59, 130, 246, 0.6);
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  padding: 16px;
  transition: all 0.3s ease;
  margin-bottom: 5px;
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
.footer {
  display: flex;
  justify-content: center;
  gap: 18px;
  padding: 8px 12px;
  align-items: center;
}

/* Fixed centered footer so user always sees the actions */
.footer-fixed {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 18px;
  z-index: 60;
  background: transparent; /* keep app styling */
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
  .task-form-container {
    padding: 20px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 10px;
  }

  .form-input,
  .form-select {
    width: 100%;
  }

  .task-list-container {
    padding: 0 10px;
  }
}

@media (max-width: 480px) {
  .task-form-container {
    padding: 16px;
  }
  
  .task-item {
    padding: 12px;
  }
  
  .form-header h2 {
    font-size: 20px;
  }
  
  .logo-container h1 {
    font-size: 24px;
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