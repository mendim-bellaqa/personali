<template>
  <div class="project-view">
    <UniversalBanner />
    
    <!-- HEADER -->
    <header class="project-header">
      <div class="container">
        <div class="header-title">
          <h1>PROJECTS</h1>
          <span class="project-count">{{ projects.length }} active</span>
        </div>
        
        <!-- QUICK ADD PROJECT -->
        <button @click="isAddingExpanded = !isAddingExpanded" class="add-project-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          New Project
        </button>
      </div>
    </header>
    
    <!-- QUICK ADD FORM -->
    <transition name="slide-down">
      <div v-if="isAddingExpanded" class="quick-add-section">
        <div class="container">
          <div class="quick-add-form">
            <input 
              v-model="form.title" 
              @keyup.enter="addProject"
              placeholder="Project name..." 
              class="project-input"
            />
            
            <textarea 
              v-model="form.description" 
              placeholder="Description..."
              class="project-description"
            ></textarea>
            
            <div class="form-row">
              <select v-model="form.status" class="project-select">
                <option value="planning">📋 Planning</option>
                <option value="active">🚀 Active</option>
                <option value="on-hold">⏸️ On Hold</option>
                <option value="completed">✅ Completed</option>
              </select>
              
              <select v-model="form.priority" class="project-select">
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
              
              <input 
                type="date" 
                v-model="form.deadline"
                class="project-date"
              />
            </div>
            
            <div class="form-actions">
              <button @click="resetForm" class="btn-cancel">Cancel</button>
              <button @click="addProject" :disabled="isUploading" class="btn-add">
                {{ isUploading ? 'Creating...' : 'Create Project' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- FILTERS -->
    <div class="filters-bar">
      <div class="container">
        <div class="filter-tabs">
          <button 
            v-for="filter in ['all', 'planning', 'active', 'on-hold', 'completed']" 
            :key="filter"
            @click="currentFilter = filter"
            :class="{ active: currentFilter === filter }"
            class="filter-tab"
          >
            {{ filter }}
          </button>
        </div>
        
        <div class="view-toggle">
          <button 
            @click="viewMode = 'grid'" 
            :class="{ active: viewMode === 'grid' }"
            class="view-btn"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </button>
          <button 
            @click="viewMode = 'list'" 
            :class="{ active: viewMode === 'list' }"
            class="view-btn"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- PROJECTS -->
    <main class="projects-container">
      <div class="container">
        <transition-group 
          name="project-list" 
          tag="div" 
          :class="['projects-layout', viewMode]"
        >
          <div 
            v-for="project in filteredProjects" 
            :key="project.id"
            class="project-card"
            :class="{ 
              [`status-${project.status}`]: true,
              [`priority-${project.priority}`]: true
            }"
          >
            <!-- PROJECT HEADER -->
            <div class="project-card-header">
              <div class="project-status-badge" :class="`status-${project.status}`">
                {{ getStatusIcon(project.status) }}
              </div>
              
              <div class="project-priority-badge" :class="`priority-${project.priority}`">
                {{ getPriorityIcon(project.priority) }}
              </div>
              
              <div class="project-actions">
                <button @click="startEdit(project)" class="action-btn">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button @click="showDeleteConfirm(project.id)" class="action-btn delete">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- PROJECT CONTENT -->
            <div class="project-content">
              <h3 class="project-title">{{ project.title }}</h3>
              <p v-if="project.description" class="project-desc">{{ project.description }}</p>
              
              <!-- PROGRESS BAR -->
              <div class="progress-section">
                <div class="progress-header">
                  <span class="progress-label">Progress</span>
                  <span class="progress-value">{{ project.progress || 0 }}%</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: `${project.progress || 0}%` }"
                  ></div>
                </div>
                <button @click="updateProgress(project)" class="progress-update-btn">
                  Update Progress
                </button>
              </div>
              
              <!-- PROJECT META -->
              <div class="project-meta">
                <div v-if="project.deadline" class="meta-item">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {{ formatDate(project.deadline) }}
                </div>
                
                <div class="meta-item">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Created {{ formatDate(project.createdAt) }}
                </div>
              </div>
            </div>
            
            <!-- PRIORITY INDICATOR BAR -->
            <div class="priority-indicator"></div>
          </div>
        </transition-group>
        
        <!-- EMPTY STATE -->
        <div v-if="filteredProjects.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3>{{ emptyStateMessage }}</h3>
          <p>{{ emptyStateSubtext }}</p>
          <button v-if="currentFilter === 'all'" @click="isAddingExpanded = true" class="empty-action-btn">
            Create Your First Project
          </button>
        </div>
      </div>
    </main>
    
    <!-- EDIT MODAL -->
    <transition name="modal">
      <div v-if="editingProjectId" @click="cancelEdit" class="modal-overlay">
        <div @click.stop class="modal-content">
          <div class="modal-header">
            <h3>Edit Project</h3>
            <button @click="cancelEdit" class="close-btn">×</button>
          </div>
          
          <div class="modal-body">
            <input 
              v-model="editForm.title" 
              placeholder="Project name..." 
              class="edit-input"
            />
            
            <textarea 
              v-model="editForm.description" 
              placeholder="Description..."
              class="edit-textarea"
            ></textarea>
            
            <div class="edit-row">
              <select v-model="editForm.status" class="edit-select">
                <option value="planning">📋 Planning</option>
                <option value="active">🚀 Active</option>
                <option value="on-hold">⏸️ On Hold</option>
                <option value="completed">✅ Completed</option>
              </select>
              
              <select v-model="editForm.priority" class="edit-select">
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>
            
            <input 
              type="date" 
              v-model="editForm.deadline"
              class="edit-date"
            />
          </div>
          
          <div class="modal-actions">
            <button @click="cancelEdit" class="modal-btn secondary">Cancel</button>
            <button @click="saveEdit" class="modal-btn primary">Save Changes</button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- DELETE CONFIRMATION MODAL -->
    <transition name="modal">
      <div v-if="deleteConfirmId" @click="cancelDelete" class="modal-overlay">
        <div @click.stop class="modal-content">
          <div class="modal-icon danger">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h3>Delete Project?</h3>
          <p>This will permanently delete this project. This action cannot be undone.</p>
          <div class="modal-actions">
            <button @click="cancelDelete" class="modal-btn secondary">Cancel</button>
            <button @click="confirmDelete" class="modal-btn danger">Delete</button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- FAB -->
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
import { auth, db } from '../services/firebase';
import UniversalBanner from '../components/UniversalBanner.vue';

export default {
  name: 'ProjectView',
  components: { UniversalBanner },
  data() {
    return {
      projects: [],
      form: {
        title: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        deadline: '',
        progress: 0
      },
      editForm: {},
      isAddingExpanded: false,
      isUploading: false,
      editingProjectId: null,
      deleteConfirmId: null,
      currentFilter: 'all',
      viewMode: 'grid'
    };
  },
  computed: {
    filteredProjects() {
      if (this.currentFilter === 'all') {
        return this.projects;
      }
      return this.projects.filter(p => p.status === this.currentFilter);
    },
    emptyStateMessage() {
      if (this.currentFilter !== 'all') {
        return `No ${this.currentFilter} projects`;
      }
      return 'No projects yet';
    },
    emptyStateSubtext() {
      if (this.currentFilter !== 'all') {
        return 'Try switching to a different filter';
      }
      return 'Create your first project to get started';
    }
  },
  mounted() {
    this.loadProjects();
  },
  methods: {
    loadProjects() {
      if (!auth.currentUser) return;
      const q = query(collection(db, 'projects'), where('userId', '==', auth.currentUser.uid));
      onSnapshot(q, (snapshot) => {
        this.projects = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      });
    },

    async addProject() {
      if (!this.form.title.trim() || !auth.currentUser || this.isUploading) return;
      
      this.isUploading = true;
      try {
        await addDoc(collection(db, 'projects'), {
          title: this.form.title,
          description: this.form.description || '',
          status: this.form.status,
          priority: this.form.priority,
          deadline: this.form.deadline || '',
          progress: 0,
          userId: auth.currentUser.uid,
          createdAt: new Date()
        });
        
        this.resetForm();
      } catch (error) {
        console.error("Error adding project:", error);
        alert("Failed to add project: " + error.message);
      } finally {
        this.isUploading = false;
      }
    },

    resetForm() {
      this.form = {
        title: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        deadline: '',
        progress: 0
      };
      this.isAddingExpanded = false;
    },

    startEdit(project) {
      this.editingProjectId = project.id;
      this.editForm = {
        title: project.title,
        description: project.description || '',
        status: project.status,
        priority: project.priority,
        deadline: project.deadline || ''
      };
    },

    async saveEdit() {
      if (!this.editForm.title.trim()) return;
      
      try {
        await updateDoc(doc(db, 'projects', this.editingProjectId), {
          title: this.editForm.title,
          description: this.editForm.description,
          status: this.editForm.status,
          priority: this.editForm.priority,
          deadline: this.editForm.deadline
        });
        
        this.cancelEdit();
      } catch (error) {
        console.error("Error updating project:", error);
        alert("Failed to update project");
      }
    },

    cancelEdit() {
      this.editingProjectId = null;
      this.editForm = {};
    },

    async updateProgress(project) {
      const newProgress = prompt(`Enter progress percentage (0-100):`, project.progress || 0);
      if (newProgress === null) return;
      
      const progress = parseInt(newProgress);
      if (isNaN(progress) || progress < 0 || progress > 100) {
        alert('Please enter a valid number between 0 and 100');
        return;
      }
      
      try {
        await updateDoc(doc(db, 'projects', project.id), { progress });
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    },

    showDeleteConfirm(projectId) {
      this.deleteConfirmId = projectId;
    },

    cancelDelete() {
      this.deleteConfirmId = null;
    },

    async confirmDelete() {
      if (this.deleteConfirmId) {
        await deleteDoc(doc(db, 'projects', this.deleteConfirmId));
        this.deleteConfirmId = null;
      }
    },

    getStatusIcon(status) {
      const icons = {
        planning: '📋',
        active: '🚀',
        'on-hold': '⏸️',
        completed: '✅'
      };
      return icons[status] || '📋';
    },

    getPriorityIcon(priority) {
      const icons = {
        low: '🟢',
        medium: '🟡',
        high: '🟠',
        urgent: '🔴'
      };
      return icons[priority] || '🟡';
    },

    formatDate(date) {
      if (!date) return '';
      const d = typeof date === 'string' ? new Date(date) : date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }
};
</script>

<style scoped>
.project-view {
  min-height: 100vh;
  padding-bottom: 100px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* HEADER */
.project-header {
  padding: 100px 0 30px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
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

.project-count {
  padding: 4px 12px;
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255,255,255,0.6);
}

.add-project-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-project-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(99,102,241,0.4);
}

/* QUICK ADD FORM */
.quick-add-section {
  padding: 20px 0;
  margin-bottom: 20px;
}

.quick-add-form {
  background: rgba(255,255,255,0.05);
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(20px);
}

.project-input,
.project-description,
.project-select,
.project-date {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-size: 1rem;
  outline: none;
  margin-bottom: 12px;
}

.project-input {
  font-size: 1.2rem;
  font-weight: 600;
}

.project-description {
  resize: vertical;
  min-height: 80px;
  font-size: 0.9rem;
}

.project-select option,
.edit-select option {
  background: #1a1a2e;
  color: white;
  padding: 8px;
}

.project-date::-webkit-calendar-picker-indicator {
  filter: invert(1);
  opacity: 0.6;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-add {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.6);
}

.btn-cancel:hover {
  background: rgba(255,255,255,0.05);
  color: white;
}

.btn-add {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  color: white;
}

.btn-add:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(99,102,241,0.4);
}

.btn-add:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* FILTERS */
.filters-bar {
  padding: 15px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 30px;
}

.filters-bar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
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

.filter-tab:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.filter-tab.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-color: transparent;
  color: white;
}

.view-toggle {
  display: flex;
  gap: 4px;
  background: rgba(255,255,255,0.05);
  padding: 4px;
  border-radius: 8px;
}

.view-btn {
  padding: 8px;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.view-btn:hover {
  color: white;
  background: rgba(255,255,255,0.1);
}

.view-btn.active {
  color: white;
  background: rgba(99,102,241,0.3);
}

/* PROJECTS LAYOUT */
.projects-layout {
  display: grid;
  gap: 20px;
}

.projects-layout.grid {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.projects-layout.list {
  grid-template-columns: 1fr;
}

/* PROJECT CARD */
.project-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-card:hover {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.project-card-header {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.project-status-badge,
.project-priority-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.project-status-badge {
  background: rgba(255,255,255,0.1);
}

.project-priority-badge {
  flex: 1;
  background: rgba(255,255,255,0.05);
}

.project-actions {
  display: flex;
  gap: 6px;
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.project-card:hover .project-actions {
  opacity: 1;
}

.action-btn {
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

.action-btn:hover {
  background: rgba(59,130,246,0.2);
  border-color: rgba(59,130,246,0.5);
  color: #3b82f6;
}

.action-btn.delete:hover {
  background: rgba(239,68,68,0.2);
  border-color: rgba(239,68,68,0.5);
  color: #ef4444;
}

.project-content {
  margin-bottom: 16px;
}

.project-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
}

.project-desc {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.progress-section {
  margin: 16px 0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.progress-label {
  color: rgba(255,255,255,0.6);
  font-weight: 600;
}

.progress-value {
  color: white;
  font-weight: 700;
}

.progress-bar {
  height: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
  transition: width 0.3s ease;
}

.progress-update-btn {
  width: 100%;
  padding: 6px 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  color: rgba(255,255,255,0.7);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.progress-update-btn:hover {
  background: rgba(99,102,241,0.1);
  border-color: rgba(99,102,241,0.3);
  color: #6366f1;
}

.project-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
}

/* PRIORITY INDICATOR */
.priority-indicator {
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: rgba(255,255,255,0.2);
}

.project-card.priority-urgent .priority-indicator {
  background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
}

.project-card.priority-high .priority-indicator {
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
}

.project-card.priority-medium .priority-indicator {
  background: linear-gradient(180deg, #eab308 0%, #ca8a04 100%);
}

.project-card.priority-low .priority-indicator {
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
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
  margin: 0 0 24px 0;
}

.empty-action-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.empty-action-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(99,102,241,0.4);
}

/* MODALS */
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
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.6);
  font-size: 2rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: white;
}

.modal-body {
  margin-bottom: 20px;
}

.edit-input,
.edit-textarea,
.edit-select,
.edit-date {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 12px;
  color: white;
  font-size: 1rem;
  outline: none;
  margin-bottom: 12px;
}

.edit-textarea {
  resize: vertical;
  min-height: 80px;
}

.edit-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.edit-date::-webkit-calendar-picker-indicator {
  filter: invert(1);
  opacity: 0.6;
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
  text-align: center;
}

.modal-content p {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.6);
  margin: 0 0 24px 0;
  text-align: center;
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

.modal-btn.primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  color: white;
}

.modal-btn.primary:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(99,102,241,0.4);
}

.modal-btn.danger {
  background: rgba(239,68,68,0.2);
  border: 1px solid rgba(239,68,68,0.5);
  color: #ef4444;
}

.modal-btn.danger:hover {
  background: rgba(239,68,68,0.3);
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

.project-list-move,
.project-list-enter-active,
.project-list-leave-active {
  transition: all 0.3s ease;
}

.project-list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.project-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.project-list-leave-active {
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

@media (max-width: 768px) {
  .header-title h1 {
    font-size: 2rem;
  }
  
  .projects-layout.grid {
    grid-template-columns: 1fr;
  }
  
  .form-row,
  .edit-row {
    grid-template-columns: 1fr;
  }
}
</style>