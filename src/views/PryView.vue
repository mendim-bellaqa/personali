<template>
  <div class="min-h-screen bg-black overflow-hidden flex items-center justify-center p-5 text-white select-none relative">
    <!-- Universal Banner -->
    <UniversalBanner />
    
    <!-- Animated Background with Magnetic Particles -->
    <div class="fixed inset-0 z-0">
      <div class="animated-bg">
        <div class="magnetic-particles" ref="particleContainer">
          <div 
            v-for="i in magneticParticlesCount" 
            :key="i" 
            class="magnetic-particle" 
            :data-id="i"
            :style="{ '--delay': i * 0.5 + 's' }"
          ></div>
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

          <!-- Plan and Deadline on one row -->
          <div class="form-row form-row-split">
            <div class="split-half plan-field">
              <select v-model="form.plan" class="form-select liquid-glass-input">
                <option value="A">Plan A</option>
                <option value="B">Plan B</option>
                <option value="C">Plan C</option>
              </select>
            </div>

            <div class="split-half date-field">
              <div class="date-wrapper">
                <input
                  type="date"
                  v-model="form.deadline"
                  class="form-input liquid-glass-input"
                />
                <span v-if="!form.deadline" class="date-placeholder"></span>
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
                      <button @click="incrementMiningPoints(task)" class="mining-btn">
                        <span class="mining-points">{{ task.miningPoints || 0 }}</span>
                        <svg class="mining-icon" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                        </svg>
                      </button>
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
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
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
    <footer class="footer footer-fixed" role="contentinfo">
      <button @click="backToCollection" class="footer-btn">Collection</button>
      <button @click="viewArchivedTasks" class="footer-btn">ARCHIVE</button>
      
      <button @click="sendMarkedToArchive" class="footer-btn">DONE</button>
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
  name: 'PryView',
  components: {
    UniversalBanner,
    ConfirmModal
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
      },
      showDeleteConfirm: false,
      pendingDeleteId: null,
      magneticParticlesCount: 15,
      particles: []
    };
  },
  mounted() {
    this.loadTasks();
    // initialize magnetic particles for smooth repulsive motion
    this.$nextTick(() => {
      this.setupMagneticParticles();
    });
  },
  methods: {
    loadTasks() {
      if (!auth.currentUser) {
        console.log('No authenticated user, skipping task load');
        this.tasks = [];
        return;
      }

      try {
        // Simplified query without composite index requirements
        const tasksQuery = query(
          collection(db, 'tasks'),
          where('userId', '==', auth.currentUser.uid)
        );

        onSnapshot(tasksQuery, (snapshot) => {
          try {
            this.tasks = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            .filter(task => !task.archived)
            .sort((a, b) => {
              // Sort by newest first (newest tasks at top)
              if (a.createdAt && b.createdAt) {
                return new Date(b.createdAt) - new Date(a.createdAt);
              }
              return (a.order || 0) - (b.order || 0);
            });
          } catch (error) {
            console.error('Error processing tasks snapshot:', error);
            this.tasks = [];
          }
        }, (error) => {
          console.error('Error listening to tasks:', error);
          // Don't clear tasks on error, keep existing data
        });
      } catch (error) {
        console.error('Error setting up tasks listener:', error);
        this.tasks = [];
      }
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

    setupMagneticParticles() {
      // Initialize particles with magnetic repulsion physics
      try {
        const container = this.$refs.particleContainer;
        if (!container) return;

        this.particles = [];
        const containerRect = container.getBoundingClientRect();
        
        for (let i = 0; i < this.magneticParticlesCount; i++) {
          this.particles.push({
            id: i,
            x: Math.random() * containerRect.width,
            y: Math.random() * containerRect.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: 8 + Math.random() * 12,
            opacity: 0.3 + Math.random() * 0.7,
            color: `hsl(${Math.random() * 60 + 180}, 70%, ${50 + Math.random() * 30}%)`
          });
        }

        this.animateMagneticParticles();
      } catch (err) {
        console.warn('setupMagneticParticles failed', err);
      }
    },

    animateMagneticParticles() {
      const container = this.$refs.particleContainer;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      const repulsionRadius = 100;
      const repulsionStrength = 0.5;

      const updateParticles = () => {
        this.particles.forEach((particle, i) => {
          // Apply magnetic repulsion from center
          const dx = particle.x - centerX;
          const dy = particle.y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < repulsionRadius && distance > 0) {
            const force = (repulsionRadius - distance) / repulsionRadius * repulsionStrength;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }

          // Apply repulsion between particles
          this.particles.forEach((otherParticle, j) => {
            if (i !== j) {
              const dx = particle.x - otherParticle.x;
              const dy = particle.y - otherParticle.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const minDistance = (particle.size + otherParticle.size) / 2 + 20;
              
              if (distance < minDistance && distance > 0) {
                const force = (minDistance - distance) / minDistance * repulsionStrength * 0.5;
                particle.vx += (dx / distance) * force;
                particle.vy += (dy / distance) * force;
              }
            }
          });

          // Apply velocity damping
          particle.vx *= 0.99;
          particle.vy *= 0.99;

          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Boundary collision with bounce
          if (particle.x <= 0 || particle.x >= containerRect.width) {
            particle.vx *= -0.8;
            particle.x = Math.max(0, Math.min(containerRect.width, particle.x));
          }
          if (particle.y <= 0 || particle.y >= containerRect.height) {
            particle.vy *= -0.8;
            particle.y = Math.max(0, Math.min(containerRect.height, particle.y));
          }
        });

        // Update DOM
        this.particles.forEach(particle => {
          const element = container.querySelector(`[data-id="${particle.id}"]`);
          if (element) {
            element.style.left = `${particle.x - particle.size / 2}px`;
            element.style.top = `${particle.y - particle.size / 2}px`;
            element.style.width = `${particle.size}px`;
            element.style.height = `${particle.size}px`;
            element.style.opacity = particle.opacity;
            element.style.backgroundColor = particle.color;
          }
        });

        requestAnimationFrame(updateParticles);
      };

      updateParticles();
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

.magnetic-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.magnetic-particle {
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 0 20px currentColor;
  transition: all 0.1s ease-out;
  will-change: transform;
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
    padding: 12px;
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