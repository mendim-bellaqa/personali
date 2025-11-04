<template>
  <div class="min-h-screen bg-black overflow-hidden flex items-center justify-center p-4 text-white select-none">
    <!-- Animated Grid Background -->
    <div class="fixed inset-0 z-0 opacity-20">
      <div class="bg-grid-pattern animate-gridMove"></div>
    </div>

    <!-- Main Liquid Glass Container -->
    <div class="relative z-10 flex flex-col w-full max-w-2xl max-w-[95vw] h-[90vh] max-h-[900px] rounded-3xl border border-white/20 border-t-white/30 bg-gradient-to-b from-white/20 to-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden">
      
      <!-- Header with Add Task Form -->
      <header class="text-center p-4 sm:p-6 border-b border-white/10 bg-gradient-to-b from-white/10 to-transparent">
        <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">TSK</h1>
        <p class="mt-1 text-gray-300 text-sm">Your daily productivity hub</p>
        
        <!-- Integrated Add Task Form -->
        <form @submit.prevent="addTask" class="mt-4 space-y-3 tsk-form">
          <!-- Task Title and Plan Row -->
          <div class="flex gap-2 flex-col sm:flex-row">
            <input
              type="text"
              v-model="form.title"
              placeholder="What needs to be done?"
              class="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
            />
            <select
              v-model="form.plan"
              class="bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all sm:w-24"
            >
              <option value="A">Plan A</option>
              <option value="B">Plan B</option>
              <option value="C">Plan C</option>
            </select>
          </div>

          <!-- Description -->
          <textarea
            v-model="form.description"
            placeholder="Add more details... (optional)"
            rows="2"
            class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all resize-none"
          ></textarea>

          <!-- Deadline and Add Button Row -->
          <div class="flex gap-3 items-center flex-col sm:flex-row">
            <input
              type="date"
              v-model="form.deadline"
              class="bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all w-full sm:w-auto"
            />
            <button
              type="submit"
              :disabled="!form.title.trim()"
              class="px-6 py-3 liquid-glass disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform transition-all duration-200 font-medium w-full sm:w-auto"
            >
              <span v-if="!form.title.trim()">Add Task</span>
              <span v-else>+ Add Task</span>
            </button>
          </div>
        </form>
      </header>

      <!-- Task List with Drag & Drop -->
      <div class="flex-grow overflow-hidden">
        <div class="h-full overflow-y-auto p-4 sm:p-6">
          <div class="space-y-3">
            <transition-group name="task" tag="div">
              <div
                v-for="(task, index) in tasks"
                :key="task.id"
                :draggable="true"
                @dragstart="onDragStart($event, index)"
                @dragover.prevent
                @drop="onDrop($event, index)"
                @dragend="onDragEnd"
                class="task-item liquid-glass-card p-3 sm:p-5 rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 cursor-move group"
                :class="{ 'opacity-50': isDragging }"
              >
                <div class="flex items-start gap-3">
                  <!-- Drag Handle -->
                  <div class="drag-handle flex-shrink-0 mt-1 text-gray-400 group-hover:text-white transition-colors">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                    </svg>
                  </div>

                  <!-- Checkbox -->
                  <input
                    type="checkbox"
                    v-model="task.completed"
                    @change="updateTask(task)"
                    class="h-4 w-4 mt-1 rounded border-white/30 bg-white/10 checked:bg-green-500 checked:border-green-500 focus:ring-green-400/50 flex-shrink-0"
                  />

                  <!-- Task Content -->
                  <div class="flex-grow min-w-0">
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <div class="flex items-center gap-2 flex-wrap">
                        <h3 :class="['font-semibold text-sm sm:text-lg', task.completed ? 'line-through text-gray-400' : 'text-white']">
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
                    
                    <p v-if="task.description" :class="['text-xs sm:text-sm mb-3 leading-relaxed', task.completed ? 'line-through text-gray-500' : 'text-gray-300']">
                      {{ task.description }}
                    </p>

                    <!-- Image Preview -->
                    <div v-if="task.imageUrl" class="mt-3">
                      <img
                        :src="task.imageUrl"
                        class="max-h-20 sm:max-h-32 rounded-lg border border-white/20"
                      />
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex gap-2 flex-shrink-0">
                    <!-- Edit Button -->
                    <button
                      @click="startEditTask(task)"
                      class="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                    </button>
                    
                    <!-- Delete Button -->
                    <button
                      @click="deleteTask(task.id)"
                      class="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
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
            <div v-if="tasks.length === 0" class="text-center py-12 sm:py-16">
              <div class="text-gray-400 mb-4">
                <svg class="w-16 h-16 sm:w-20 sm:h-20 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No tasks yet</h3>
              <p class="text-gray-400 text-sm">Start being productive! Add your first task above.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Controls -->
      <footer class="p-4 border-t border-white/10 bg-gradient-to-t from-white/5 to-transparent">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div class="flex gap-2 sm:gap-3 flex-wrap">
            <button
              @click="archiveCompletedTasks"
              class="px-3 py-2 liquid-glass text-xs sm:text-sm"
              :disabled="!hasCompletedTasks"
            >
              📦 Archive ({{ completedTasksCount }})
            </button>
            <router-link
              to="/archive"
              class="px-3 py-2 liquid-glass text-xs sm:text-sm"
            >
              📂 View Archive
            </router-link>
          </div>
          <router-link to="/" class="text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors">
            ← Back to Collection
          </router-link>
        </div>
      </footer>
    </div>

    <!-- Edit Task Modal -->
    <div v-if="editingTask" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-black/90 border border-white/20 rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4 text-white">Edit Task</h3>
        <form @submit.prevent="saveTaskEdit">
          <div class="space-y-4">
            <input
              v-model="editingTask.title"
              type="text"
              placeholder="Task title"
              class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            />
            <textarea
              v-model="editingTask.description"
              placeholder="Description (optional)"
              rows="3"
              class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 resize-none"
            ></textarea>
            <div class="flex gap-3 items-center">
              <select
                v-model="editingTask.plan"
                class="bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 flex-1"
              >
                <option value="A">Plan A</option>
                <option value="B">Plan B</option>
                <option value="C">Plan C</option>
              </select>
              <input
                v-model="editingTask.deadline"
                type="date"
                class="bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50 flex-1"
              />
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="cancelEdit"
              class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 liquid-glass-primary rounded-xl font-medium"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
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
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export default {
  name: 'TskView',
  data() {
    return {
      tasks: [],
      isDragging: false,
      dragIndex: null,
      loading: false,
      editingTask: null,
      form: {
        title: '',
        plan: 'A',
        description: '',
        deadline: '',
        imageFile: null,
        imageUrl: null
      }
    };
  },
  computed: {
    hasCompletedTasks() {
      return this.tasks.some(task => task.completed);
    },
    completedTasksCount() {
      return this.tasks.filter(task => task.completed).length;
    }
  },
  mounted() {
    this.loadTasks();
  },
  methods: {
    async loadTasks() {
      if (!auth.currentUser) {
        console.log('User not authenticated');
        return;
      }

      this.loading = true;
      try {
        const tasksQuery = query(
          collection(db, 'tasks'),
          where('userId', '==', auth.currentUser.uid),
          where('archived', '==', false),
          orderBy('order', 'asc')
        );

        onSnapshot(tasksQuery, (snapshot) => {
          this.tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          this.loading = false;
        });
      } catch (error) {
        console.error('Error loading tasks:', error);
        this.loading = false;
      }
    },

    onFileChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      
      this.form.imageFile = file;
      this.form.imageUrl = URL.createObjectURL(file);
    },

    async addTask() {
      // Check authentication
      if (!this.form.title.trim()) {
        alert('Please enter a task title.');
        return;
      }

      if (!auth.currentUser) {
        alert('Please sign in to create tasks.');
        return;
      }

      console.log('Creating task for user:', auth.currentUser.uid);
      console.log('Task data:', {
        title: this.form.title.trim(),
        plan: this.form.plan,
        description: this.form.description,
        deadline: this.form.deadline || null,
        completed: false,
        imageUrl: this.form.imageUrl || null,
        archived: false,
        userId: auth.currentUser.uid,
        order: this.tasks.length,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      try {
        const newTask = {
          title: this.form.title.trim(),
          plan: this.form.plan,
          description: this.form.description,
          deadline: this.form.deadline || null,
          completed: false,
          imageUrl: this.form.imageUrl || null,
          archived: false,
          userId: auth.currentUser.uid,
          order: this.tasks.length,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'tasks'), newTask);
        console.log('Task created successfully with ID:', docRef.id);

        // Reset form
        this.form = {
          title: '',
          plan: 'A',
          description: '',
          deadline: '',
          imageFile: null,
          imageUrl: null
        };

        // Show success message
        alert('Task created successfully!');
      } catch (error) {
        console.error('Error adding task:', error);
        
        // More specific error messages
        let errorMessage = 'Failed to add task. ';
        if (error.code === 'permission-denied') {
          errorMessage += 'Permission denied. Please check your Firestore security rules.';
        } else if (error.code === 'unauthenticated') {
          errorMessage += 'You need to be signed in to create tasks.';
        } else if (error.code === 'unavailable') {
          errorMessage += 'Service temporarily unavailable. Please try again later.';
        } else {
          errorMessage += 'Please try again. (' + error.message + ')';
        }
        
        alert(errorMessage);
      }
    },

    async updateTask(task) {
      if (!auth.currentUser) return;

      try {
        const updateData = {
          completed: task.completed,
          updatedAt: serverTimestamp()
        };

        // Add completedAt timestamp when task is marked as completed
        if (task.completed) {
          updateData.completedAt = serverTimestamp();
        }

        await updateDoc(doc(db, 'tasks', task.id), updateData);
      } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task. Please try again.');
      }
    },

    async deleteTask(taskId) {
      if (!auth.currentUser) return;

      try {
        await deleteDoc(doc(db, 'tasks', taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    },

    async archiveCompletedTasks() {
      if (!auth.currentUser) return;

      try {
        const completedTasks = this.tasks.filter(task => task.completed);
        
        if (completedTasks.length === 0) {
          alert('No completed tasks to archive.');
          return;
        }

        const batch = [];
        for (const task of completedTasks) {
          batch.push(updateDoc(doc(db, 'tasks', task.id), {
            archived: true,
            updatedAt: serverTimestamp()
          }));
        }

        await Promise.all(batch);
        
        alert(`${completedTasks.length} tasks archived successfully!`);
      } catch (error) {
        console.error('Error archiving tasks:', error);
        alert('Failed to archive tasks. Please try again.');
      }
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
    async onDragStart(e, index) {
      this.dragIndex = index;
      this.isDragging = true;
      e.dataTransfer.effectAllowed = 'move';
    },
    
    async onDrop(e, dropIndex) {
      e.preventDefault();
      
      if (this.dragIndex === null || this.dragIndex === dropIndex) {
        return;
      }
      
      const draggedTask = this.tasks[this.dragIndex];
      
      // Remove the dragged task
      this.tasks.splice(this.dragIndex, 1);
      
      // Insert at the new position
      this.tasks.splice(dropIndex, 0, draggedTask);
      
      // Update orders in database
      await this.updateTaskOrders();
      this.isDragging = false;
      this.dragIndex = null;
    },
    
    onDragEnd() {
      this.isDragging = false;
      this.dragIndex = null;
    },
    
    async updateTaskOrders() {
      if (!auth.currentUser) return;

      try {
        // Update the order property for all tasks in database
        const updatePromises = this.tasks.map((task, index) => {
          return updateDoc(doc(db, 'tasks', task.id), {
            order: index,
            updatedAt: serverTimestamp()
          });
        });

        await Promise.all(updatePromises);
      } catch (error) {
        console.error('Error updating task orders:', error);
      }
    },

    // Edit Task Methods
    startEditTask(task) {
      this.editingTask = { ...task };
    },

    async saveTaskEdit() {
      if (!this.editingTask || !auth.currentUser) return;

      try {
        await updateDoc(doc(db, 'tasks', this.editingTask.id), {
          title: this.editingTask.title.trim(),
          description: this.editingTask.description,
          plan: this.editingTask.plan,
          deadline: this.editingTask.deadline || null,
          updatedAt: serverTimestamp()
        });

        // Update local task
        const taskIndex = this.tasks.findIndex(t => t.id === this.editingTask.id);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = { ...this.editingTask };
        }

        this.editingTask = null;
        alert('Task updated successfully!');
      } catch (error) {
        console.error('Error updating task:', error);
        alert('Failed to update task. Please try again.');
      }
    },

    cancelEdit() {
      this.editingTask = null;
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

.liquid-glass-primary {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.liquid-glass-primary:hover {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.5);
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

/* Drag and Drop Animations */
.task-move {
  transition: transform 0.3s ease;
}

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

/* Drag Handle Animation */
.drag-handle {
  opacity: 0.5;
  transition: all 0.3s ease;
}

.group:hover .drag-handle {
  opacity: 1;
  transform: scale(1.1);
}

/* Task Item Drag State */
.task-item.dragging {
  opacity: 0.6;
  transform: rotate(2deg);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}

/* Checkbox Styling */
input[type="checkbox"] {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

input[type="checkbox"]:checked {
  background: linear-gradient(135deg, #10b981, #059669);
  border-color: #10b981;
}

input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.875rem;
  font-weight: bold;
}

input[type="checkbox"]:focus {
  outline: 2px solid rgba(16, 185, 129, 0.5);
  outline-offset: 2px;
}

/* Task Form Styles */
.tsk-form {
  width: 50%; /* Reduce width to half of the screen */
  margin: 0 auto; /* Center the form */
  padding: 20px; /* Add spacing inside the form */
  box-sizing: border-box; /* Ensure padding doesn't affect width */
}

.tsk-form input,
.tsk-form select,
.tsk-form button {
  margin-bottom: 10px; /* Add spacing between elements */
}
</style>