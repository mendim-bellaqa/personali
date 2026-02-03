<template>
  <div class="tsk-view">
    <UniversalBanner />
    
    <!-- HEADER WITH QUICK ADD -->
    <header class="tsk-header">
      <div class="container">
        <div class="header-title">
          <h1>TASKS</h1>
          <span class="task-count">{{ tasks.length }} active</span>
        </div>
        
        <!-- QUICK ADD TASK -->
        <div class="quick-add" :class="{ 'expanded': isAddingExpanded }">
          <div class="quick-add-main">
            <input 
              v-model="form.title" 
              @keyup.enter="addTask"
              @focus="isAddingExpanded = true"
              placeholder="What needs to be done?" 
              class="task-input"
            />
            <button @click="addTask" :disabled="isUploading" class="add-btn">
              <svg v-if="!isUploading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <svg v-else class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            </button>
          </div>
          
          <!-- EXPANDED OPTIONS -->
          <transition name="slide-down">
            <div v-if="isAddingExpanded" class="task-options">
              <textarea 
                v-model="form.description" 
                placeholder="Add description..."
                class="task-description"
              ></textarea>
              
              <div class="task-meta">
                <input 
                  type="date" 
                  v-model="form.planDate"
                  class="task-date"
                />
                
                <select v-model="form.priority" class="task-priority">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                
                <!-- URGENCY TOGGLE -->
                <label class="urgency-toggle" :class="{ active: form.urgent }">
                  <input type="checkbox" v-model="form.urgent" hidden />
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Urgent
                </label>
                
                <label class="file-upload">
                  <input type="file" accept="image/*" @change="handleFileChange" hidden />
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {{ form.fileName || 'Attach' }}
                </label>
                
                <button @click="resetForm" class="cancel-btn">Cancel</button>
              </div>
              
              <div v-if="previewUrl" class="image-preview">
                <img :src="previewUrl" alt="Preview" />
                <button @click="clearFile" class="remove-preview">×</button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </header>
    
    <!-- FILTERS & ACTIONS -->
    <div class="toolbar">
      <div class="container">
        <div class="filters">
          <button 
            v-for="filter in ['all', 'active', 'completed']" 
            :key="filter"
            @click="currentFilter = filter"
            :class="{ active: currentFilter === filter }"
            class="filter-btn"
          >
            {{ filter }}
          </button>
        </div>
        
        <div class="actions">
          <button 
            v-if="completedCount > 0"
            @click="showArchiveConfirm" 
            class="archive-btn"
          >
            Archive {{ completedCount }} completed
          </button>
        </div>
      </div>
    </div>
    
    <!-- TASKS LIST -->
    <main class="tasks-container">
      <div class="container">
        <transition-group name="task-list" tag="div" class="task-grid">
          <div 
            v-for="task in filteredTasks" 
            :key="task.id"
            class="task-card"
            :class="{ 
              'completed': task.completed,
              'editing': editingTaskId === task.id,
              'urgent': task.urgent,
              [`priority-${task.priority || 'medium'}`]: true
            }"
          >
            <!-- TASK HEADER -->
            <div class="task-header">
              <button 
                @click="toggleTask(task)" 
                class="checkbox"
                :class="{ checked: task.completed }"
              >
                <svg v-if="task.completed" class="checkmark" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
              </button>
              
              <div class="task-info">
                <input 
                  v-if="editingTaskId === task.id"
                  v-model="task.title"
                  @blur="saveTask(task)"
                  @keyup.enter="saveTask(task)"
                  @keyup.esc="cancelEdit"
                  class="task-title-edit"
                  ref="editInput"
                />
                <h3 v-else @dblclick="startEdit(task)" class="task-title">
                  {{ task.title }}
                </h3>
                
                <p v-if="task.description && editingTaskId !== task.id" class="task-desc">
                  {{ task.description }}
                </p>
              </div>
              
              <div class="task-actions">
                <button @click="incrementCount(task)" class="count-btn">
                  <span>{{ task.count || 0 }}</span>
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
                
                <button @click="startEdit(task)" class="edit-btn">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                
                <button @click="showDeleteConfirm(task.id)" class="delete-btn">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- TASK IMAGE -->
            <div v-if="task.imageUrl" class="task-image">
              <img :src="task.imageUrl" alt="Task attachment" />
            </div>
            
            <!-- TASK FOOTER -->
            <div class="task-footer">
              <span v-if="task.planDate" class="task-date-badge">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                {{ task.planDate }}
              </span>
              
              <span class="task-created">
                {{ formatDate(task.createdAt) }}
              </span>
            </div>
            
            <!-- PRIORITY INDICATOR -->
            <div class="priority-bar"></div>
          </div>
        </transition-group>
        
        <!-- EMPTY STATE -->
        <div v-if="filteredTasks.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3>{{ emptyStateMessage }}</h3>
          <p>{{ emptyStateSubtext }}</p>
        </div>
      </div>
    </main>
    
    <!-- DELETE MODAL -->
    <transition name="modal">
      <div v-if="deleteConfirmId" @click="cancelDelete" class="modal-overlay">
        <div @click.stop class="modal-content">
          <div class="modal-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h3>Delete Task?</h3>
          <p>This action cannot be undone.</p>
          <div class="modal-actions">
            <button @click="cancelDelete" class="modal-btn secondary">Cancel</button>
            <button @click="confirmDelete" class="modal-btn danger">Delete</button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- ARCHIVE CONFIRMATION MODAL -->
    <transition name="modal">
      <div v-if="showArchiveModal" @click="cancelArchive" class="modal-overlay">
        <div @click.stop class="modal-content archive-modal">
          <div class="modal-icon archive-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
            </svg>
          </div>
          <h3>Archive Completed Tasks?</h3>
          <p>Do you really want to archive {{ completedCount }} completed task{{ completedCount > 1 ? 's' : '' }}?</p>
          <div class="modal-actions">
            <button @click="cancelArchive" class="modal-btn secondary">No</button>
            <button @click="confirmArchive" class="modal-btn success">Yes</button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- FLOATING ACTION BUTTON (Mobile) -->
    <button @click="$router.push('/')" class="fab">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    </button>
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
} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from '../services/firebase';
import UniversalBanner from '../components/UniversalBanner.vue';

export default {
  name: 'TskView',
  components: { UniversalBanner },
  data() {
    return {
      tasks: [],
      form: { 
        title: '',
        description: '',
        planDate: '',
        fileName: '',
        priority: 'medium',
        urgent: false
      },
      mediaFile: null,
      previewUrl: null,
      isAddingExpanded: false,
      isUploading: false,
      deleteConfirmId: null,
      editingTaskId: null,
      currentFilter: 'all',
      showArchiveModal: false
    };
  },
  computed: {
    filteredTasks() {
      if (this.currentFilter === 'active') {
        return this.tasks.filter(t => !t.completed);
      } else if (this.currentFilter === 'completed') {
        return this.tasks.filter(t => t.completed);
      }
      return this.tasks;
    },
    completedCount() {
      return this.tasks.filter(t => t.completed).length;
    },
    emptyStateMessage() {
      if (this.currentFilter === 'completed') return 'No completed tasks';
      if (this.currentFilter === 'active') return 'No active tasks';
      return 'No tasks yet';
    },
    emptyStateSubtext() {
      if (this.currentFilter === 'completed') return 'Complete some tasks to see them here';
      return 'Create your first task to get started';
    }
  },
  mounted() {
    this.loadTasks();
  },
  methods: {
    loadTasks() {
      if (!auth.currentUser) return;
      const q = query(collection(db, 'tasks'), where('userId', '==', auth.currentUser.uid));
      onSnapshot(q, (snapshot) => {
        this.tasks = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(t => !t.archived)
          .sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return b.createdAt?.seconds - a.createdAt?.seconds;
          });
      });
    },

    handleFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.mediaFile = file;
        this.form.fileName = file.name;
        this.previewUrl = URL.createObjectURL(file);
      }
    },

    clearFile() {
      this.mediaFile = null;
      this.form.fileName = '';
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl);
        this.previewUrl = null;
      }
    },

    resetForm() {
      this.form = { title: '', description: '', planDate: '', fileName: '', priority: 'medium', urgent: false };
      this.clearFile();
      this.isAddingExpanded = false;
    },

    async addTask() {
      if (!this.form.title.trim() || !auth.currentUser || this.isUploading) return;
      
      this.isUploading = true;
      let imageUrl = null;

      try {
        if (this.mediaFile) {
          const sanitizedName = this.mediaFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const fileRef = storageRef(storage, `tasks/${auth.currentUser.uid}/${Date.now()}_${sanitizedName}`);
          const snapshot = await uploadBytes(fileRef, this.mediaFile);
          imageUrl = await getDownloadURL(snapshot.ref);
        }

        await addDoc(collection(db, 'tasks'), {
          title: this.form.title,
          description: this.form.description || '',
          planDate: this.form.planDate || '',
          priority: this.form.priority || 'medium',
          urgent: this.form.urgent || false,
          imageUrl: imageUrl,
          completed: false,
          archived: false,
          count: 0,
          userId: auth.currentUser.uid,
          createdAt: new Date()
        });
        
        this.resetForm();
      } catch (error) {
        console.error("Error adding task:", error);
        alert("Failed to add task: " + error.message);
      } finally {
        this.isUploading = false;
      }
    },

    async toggleTask(task) {
      await updateDoc(doc(db, 'tasks', task.id), { completed: !task.completed });
    },

    async incrementCount(task) {
      await updateDoc(doc(db, 'tasks', task.id), { count: (task.count || 0) + 1 });
    },

    startEdit(task) {
      this.editingTaskId = task.id;
      this.$nextTick(() => {
        const input = this.$refs.editInput?.[0];
        if (input) input.focus();
      });
    },

    async saveTask(task) {
      if (task.title.trim()) {
        await updateDoc(doc(db, 'tasks', task.id), { 
          title: task.title,
          description: task.description || ''
        });
      }
      this.editingTaskId = null;
    },

    cancelEdit() {
      this.editingTaskId = null;
      this.loadTasks(); // Reload to reset unsaved changes
    },

    showDeleteConfirm(taskId) {
      this.deleteConfirmId = taskId;
    },

    cancelDelete() {
      this.deleteConfirmId = null;
    },

    async confirmDelete() {
      if (this.deleteConfirmId) {
        await deleteDoc(doc(db, 'tasks', this.deleteConfirmId));
        this.deleteConfirmId = null;
      }
    },

    showArchiveConfirm() {
      this.showArchiveModal = true;
    },

    cancelArchive() {
      this.showArchiveModal = false;
    },

    async confirmArchive() {
      const completedTasks = this.tasks.filter(t => t.completed);
      await Promise.all(completedTasks.map(task => 
        updateDoc(doc(db, 'tasks', task.id), { archived: true })
      ));
      this.showArchiveModal = false;
    },

    formatDate(date) {
      if (!date) return '';
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }
};
</script>

<style scoped>
.tsk-view {
  min-height: 100vh;
  padding-bottom: 100px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

/* HEADER */
.tsk-header {
  padding: 100px 0 30px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.header-title h1 {
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, #fff 0%, #a0a0a0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.task-count {
  padding: 4px 12px;
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255,255,255,0.6);
}

/* QUICK ADD */
.quick-add {
  background: rgba(255,255,255,0.05);
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.quick-add.expanded {
  border-color: rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.08);
}

.quick-add-main {
  display: flex;
  gap: 12px;
}

.task-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 8px 0;
}

.task-input::placeholder {
  color: rgba(255,255,255,0.3);
}

.add-btn {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.add-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(99,102,241,0.4);
}

.add-btn:active {
  transform: scale(0.95);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* TASK OPTIONS */
.task-options {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.task-description {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 60px;
  margin-bottom: 12px;
  outline: none;
}

.task-description:focus {
  border-color: rgba(255,255,255,0.3);
}

.task-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.task-date,
.task-priority {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 8px 12px;
  color: white;
  font-size: 0.85rem;
  outline: none;
}

/* Fix dropdown option visibility */
.task-priority option {
  background: #1a1a2e;
  color: white;
  padding: 8px;
}

.task-date::-webkit-calendar-picker-indicator {
  filter: invert(1);
  opacity: 0.6;
}

/* URGENCY TOGGLE */
.urgency-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.urgency-toggle:hover {
  background: rgba(255,255,255,0.1);
}

.urgency-toggle.active {
  background: rgba(239,68,68,0.15);
  border-color: rgba(239,68,68,0.4);
  color: #ef4444;
}

.urgency-toggle.active svg {
  color: #ef4444;
}

.file-upload {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-upload:hover {
  background: rgba(255,255,255,0.1);
}

.cancel-btn {
  margin-left: auto;
  padding: 8px 16px;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.5);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s ease;
}

.cancel-btn:hover {
  color: white;
}

.image-preview {
  position: relative;
  margin-top: 12px;
  border-radius: 8px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.remove-preview {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: rgba(0,0,0,0.7);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* TOOLBAR */
.toolbar {
  padding: 20px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 20px;
}

.toolbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.filters {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 6px 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  color: rgba(255,255,255,0.6);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.filter-btn.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-color: transparent;
  color: white;
}

.archive-btn {
  padding: 6px 16px;
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.3);
  border-radius: 20px;
  color: rgb(34,197,94);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.archive-btn:hover {
  background: rgba(34,197,94,0.2);
}

/* TASK GRID */
.task-grid {
  display: grid;
  gap: 16px;
}

.task-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.task-card:hover {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.task-card.completed {
  opacity: 0.6;
}

.task-card.completed .task-title {
  text-decoration: line-through;
}

/* URGENT TASK STYLING */
.task-card.urgent {
  background: linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(220,38,38,0.05) 100%);
  border-color: rgba(239,68,68,0.3);
}

.task-card.urgent:hover {
  background: linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(220,38,38,0.08) 100%);
  border-color: rgba(239,68,68,0.5);
  box-shadow: 0 8px 24px rgba(239,68,68,0.2);
}

.task-card.urgent .priority-bar {
  background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
  width: 5px;
  box-shadow: 0 0 10px rgba(239,68,68,0.5);
}

/* PRIORITY INDICATOR */
.priority-bar {
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: rgba(255,255,255,0.2);
}

.task-card.priority-high .priority-bar {
  background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
}

.task-card.priority-medium .priority-bar {
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
}

.task-card.priority-low .priority-bar {
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
}

/* TASK HEADER */
.task-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.checkbox {
  width: 24px;
  height: 24px;
  min-width: 24px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-top: 2px;
}

.checkbox:hover {
  border-color: rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.05);
}

.checkbox.checked {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-color: transparent;
}

.checkmark {
  width: 14px;
  height: 14px;
  color: white;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-title,
.task-title-edit {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 6px 0;
  line-height: 1.4;
}

.task-title-edit {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px;
  padding: 6px 8px;
  outline: none;
}

.task-desc {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  margin: 0;
  line-height: 1.5;
}

.task-actions {
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.task-card:hover .task-actions {
  opacity: 1;
}

.count-btn,
.edit-btn,
.delete-btn {
  width: 32px;
  height: 32px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.count-btn {
  font-size: 0.75rem;
  font-weight: 700;
  gap: 2px;
}

.count-btn:hover {
  background: rgba(99,102,241,0.2);
  border-color: rgba(99,102,241,0.5);
  color: #6366f1;
}

.edit-btn:hover {
  background: rgba(59,130,246,0.2);
  border-color: rgba(59,130,246,0.5);
  color: #3b82f6;
}

.delete-btn:hover {
  background: rgba(239,68,68,0.2);
  border-color: rgba(239,68,68,0.5);
  color: #ef4444;
}

/* TASK IMAGE */
.task-image {
  margin: 12px 0;
  border-radius: 8px;
  overflow: hidden;
}

.task-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* TASK FOOTER */
.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.task-date-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.6);
}

.task-created {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.3);
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  color: rgba(255,255,255,0.2);
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255,255,255,0.6);
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.4);
  margin: 0;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: rgba(20,20,30,0.95);
  border: 2px solid rgba(239,68,68,0.3);
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: rgba(239,68,68,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon svg {
  width: 32px;
  height: 32px;
  color: #ef4444;
}

.modal-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.modal-content p {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.6);
  margin: 0 0 24px 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-btn.secondary {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
}

.modal-btn.secondary:hover {
  background: rgba(255,255,255,0.1);
}

.modal-btn.danger {
  background: rgba(239,68,68,0.2);
  border: 1px solid rgba(239,68,68,0.5);
  color: #ef4444;
}

.modal-btn.danger:hover {
  background: rgba(239,68,68,0.3);
}

.modal-btn.success {
  background: rgba(34,197,94,0.2);
  border: 1px solid rgba(34,197,94,0.5);
  color: #22c55e;
}

.modal-btn.success:hover {
  background: rgba(34,197,94,0.3);
}

/* Archive Modal Specific Styling */
.archive-modal {
  border-color: rgba(34,197,94,0.3);
}

.archive-icon {
  background: rgba(34,197,94,0.1);
}

.archive-icon svg {
  color: #22c55e;
}

/* FAB */
.fab {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(99,102,241,0.4);
  transition: all 0.3s ease;
  z-index: 100;
}

.fab:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(99,102,241,0.6);
}

.fab:active {
  transform: scale(0.95);
}

@media (min-width: 768px) {
  .fab {
    bottom: 30px;
  }
}

/* ANIMATIONS */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 500px;
}

.task-list-move,
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.3s ease;
}

.task-list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.task-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.task-list-leave-active {
  position: absolute;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}
</style>