<template>
  <div class="min-h-screen overflow-hidden flex items-center justify-center p-5 text-white select-none relative">
    <!-- Universal Banner -->
    <UniversalBanner />
     
    <!-- Animated Background with Particles -->
    <div class="fixed inset-0 z-0">
      <div class="animated-bg">
        <div class="particles">
          <div v-for="i in 30" :key="i" class="particle" :style="{ '--delay': i * 0.3 + 's' }"></div>
        </div>
        <div class="bg-gradient-orb orb-1"></div>
        <div class="bg-gradient-orb orb-2"></div>
        <div class="bg-gradient-orb orb-3"></div>
        <div class="bg-gradient-orb orb-4"></div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="relative z-10 w-full max-w-6xl mx-auto main-center">
      <!-- Header Section -->
      <div class="project-header liquid-glass-card mb-6">
        <div class="header-content">
          <div class="header-text">
            <h1 class="text-3xl font-bold text-white mb-2">Project Management</h1>
            <p class="text-gray-300">Organize and track your projects effectively</p>
          </div>
          <button 
            @click="openCreateModal" 
            class="create-btn liquid-glass-btn"
            :disabled="isLoading"
          >
            <span class="btn-icon">+</span>
            <span>New Project</span>
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="filters-section liquid-glass-card mb-6">
        <div class="filters-content">
          <div class="filter-group">
            <label class="filter-label">Status:</label>
            <div class="filter-buttons">
              <button 
                v-for="status in statusFilters" 
                :key="status.value"
                @click="setFilter('status', status.value)"
                :class="['filter-btn', { active: activeFilters.status === status.value }]"
              >
                {{ status.label }}
              </button>
            </div>
          </div>
          <div class="filter-group">
            <label class="filter-label">Priority:</label>
            <div class="filter-buttons">
              <button 
                v-for="priority in priorityFilters" 
                :key="priority.value"
                @click="setFilter('priority', priority.value)"
                :class="['filter-btn', { active: activeFilters.priority === priority.value }]"
              >
                {{ priority.label }}
              </button>
            </div>
          </div>
          <div class="search-group">
            <input 
              v-model="searchTerm"
              type="text" 
              placeholder="Search projects..."
              class="search-input liquid-glass-input"
              @input="handleSearch"
            />
          </div>
        </div>
      </div>

      <!-- Horizontal Scrolling Cards Section -->
      <div class="cards-section-wrapper">
        <div
          ref="cardsContainer"
          class="cards-container"
          @wheel="handleWheel"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <!-- Navigation Cards matching header items -->
          <router-link
            v-for="navItem in navigationCards"
            :key="navItem.path"
            :to="navItem.path"
            class="nav-card liquid-glass-card"
          >
            <div class="nav-card-icon">{{ navItem.icon }}</div>
            <h3 class="nav-card-title">{{ navItem.name }}</h3>
            <p class="nav-card-description">{{ navItem.description }}</p>
          </router-link>
        </div>
      </div>

      <!-- Projects Grid -->
      <div class="projects-grid">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card liquid-glass-card"
        >
          <div class="project-header">
            <div class="project-info">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-description">{{ project.description }}</p>
            </div>
            <div class="project-actions">
              <button @click="editProject(project)" class="action-btn edit-btn">
                <span class="btn-icon">✏️</span>
              </button>
              <button @click="deleteProject(project)" class="action-btn delete-btn">
                <span class="btn-icon">🗑️</span>
              </button>
            </div>
          </div>

          <div class="project-meta">
            <div class="meta-item">
              <span class="meta-label">Status:</span>
              <span :class="['status-badge', `status-${project.status}`]">{{ project.status }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Priority:</span>
              <span :class="['priority-badge', `priority-${project.priority}`]">{{ project.priority }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Progress:</span>
              <div class="progress-container">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: project.progress + '%' }"
                  ></div>
                </div>
                <span class="progress-text">{{ project.progress }}%</span>
              </div>
            </div>
          </div>

          <div class="project-footer">
            <div class="project-stats">
              <div class="stat-item">
                <span class="stat-value">{{ project.tasks?.length || 0 }}</span>
                <span class="stat-label">Tasks</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ formatDate(project.createdAt) }}</span>
                <span class="stat-label">Created</span>
              </div>
            </div>
            <div class="project-progress">
              <button 
                @click="updateProgress(project)" 
                class="progress-btn"
                :disabled="isLoading"
              >
                Update Progress
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredProjects.length === 0 && !isLoading" class="empty-state liquid-glass-card">
          <div class="empty-icon">📋</div>
          <h3 class="empty-title">No projects found</h3>
          <p class="empty-text">
            {{ searchTerm || activeFilters.status !== 'all' || activeFilters.priority !== 'all' 
               ? 'Try adjusting your filters or search term' 
               : 'Create your first project to get started' }}
          </p>
          <button 
            v-if="!searchTerm && activeFilters.status === 'all' && activeFilters.priority === 'all'"
            @click="openCreateModal" 
            class="empty-action-btn liquid-glass-btn"
          >
            Create Project
          </button>
        </div>
      </div>
    </main>

    <!-- Create/Edit Project Modal -->
    <transition name="modal-fade" appear>
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <transition name="modal-slide" appear>
          <div class="modal-content liquid-glass-card" @click.stop>
            <div class="modal-header">
              <h2 class="modal-title">{{ isEditing ? 'Edit Project' : 'Create New Project' }}</h2>
              <button @click="closeModal" class="close-btn" :disabled="isLoading">×</button>
            </div>
            
            <form @submit.prevent="saveProject" class="project-form">
              <div class="form-group">
                <label for="title" class="form-label">Project Title *</label>
                <input
                  v-model="formData.title"
                  id="title"
                  type="text"
                  required
                  :class="['form-input', 'liquid-glass-input', { 'error': errors.title }]"
                  placeholder="Enter project title"
                  @input="clearError('title')"
                />
                <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
              </div>

              <div class="form-group">
                <label for="description" class="form-label">Description</label>
                <textarea
                  v-model="formData.description"
                  id="description"
                  class="form-textarea liquid-glass-input"
                  placeholder="Describe your project"
                  rows="3"
                  maxlength="500"
                ></textarea>
                <span class="char-count">{{ formData.description.length }}/500</span>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="status" class="form-label">Status</label>
                  <select
                    v-model="formData.status"
                    id="status"
                    class="form-select liquid-glass-input"
                  >
                    <option value="active">Active</option>
                    <option value="planning">Planning</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="priority" class="form-label">Priority</label>
                  <select
                    v-model="formData.priority"
                    id="priority"
                    class="form-select liquid-glass-input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="progress" class="form-label">Progress: {{ formData.progress }}%</label>
                <input
                  v-model.number="formData.progress"
                  id="progress"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  class="form-range"
                />
                <div class="progress-labels">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" @click="closeModal" class="cancel-btn" :disabled="isLoading">
                  Cancel
                </button>
                <button
                  type="submit"
                  class="save-btn liquid-glass-btn"
                  :disabled="isLoading || !isFormValid"
                >
                  <span v-if="isLoading" class="loading-spinner-small"></span>
                  {{ isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
                </button>
              </div>
            </form>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Loading Overlay -->
    <div v-if="isLoading && !showModal" class="loading-overlay">
      <div class="loading-spinner liquid-glass-card">
        <div class="spinner"></div>
        <p>Loading projects...</p>
      </div>
    </div>

    <!-- Footer Section -->
    <footer class="footer footer-fixed" role="contentinfo">
      <button @click="backToCollection" class="footer-btn">Collection</button>
      <button @click="viewArchivedTasks" class="footer-btn">TASKS</button>
      <button @click="refreshProjects" class="footer-btn">REFRESH</button>
    </footer>
  </div>
</template>

<script>
import UniversalBanner from '../components/UniversalBanner.vue';
import projectService from '../services/projectService.js';
import toastService from '../services/toastService.js';

export default {
  name: 'ProjectView',
  components: {
    UniversalBanner
  },
  data() {
    return {
      projects: [],
      filteredProjects: [],
      isLoading: false,
      showModal: false,
      isEditing: false,
      currentProjectId: null,
      searchTerm: '',
      activeFilters: {
        status: 'all',
        priority: 'all'
      },
      formData: {
        title: '',
        description: '',
        status: 'active',
        priority: 'medium',
        progress: 0
      },
      errors: {},
      statusFilters: [
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Planning', value: 'planning' },
        { label: 'On Hold', value: 'on-hold' },
        { label: 'Completed', value: 'completed' }
      ],
      priorityFilters: [
        { label: 'All', value: 'all' },
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' }
      ],
      navigationCards: [
        { name: 'Collection', path: '/', icon: '📚', description: 'Browse your collections' },
        { name: 'Tasks', path: '/tsk', icon: '✓', description: 'Manage your tasks' },
        { name: 'Projects', path: '/project', icon: '📋', description: 'Track your projects' },
        { name: 'Focus', path: '/med', icon: '🎯', description: 'Stay focused and mindful' },
        { name: 'Calendar', path: '/dwn', icon: '📅', description: 'View your schedule' },
        { name: 'Archive', path: '/archive', icon: '📦', description: 'Access archived items' }
      ],
      touchStartX: 0,
      touchEndX: 0
    };
  },
  computed: {
    filteredProjectsList() {
      let filtered = [...this.projects];

      // Apply status filter
      if (this.activeFilters.status !== 'all') {
        filtered = filtered.filter(project => project.status === this.activeFilters.status);
      }

      // Apply priority filter
      if (this.activeFilters.priority !== 'all') {
        filtered = filtered.filter(project => project.priority === this.activeFilters.priority);
      }

      // Apply search filter
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(project =>
          project.title.toLowerCase().includes(term) ||
          project.description?.toLowerCase().includes(term)
        );
      }

      return filtered;
    },

    isFormValid() {
      return this.formData.title.trim().length > 0;
    }
  },
  watch: {
    filteredProjectsList: {
      handler(newFiltered) {
        this.filteredProjects = newFiltered;
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setupParticles();
      this.loadProjects();
    });
  },
  beforeDestroy() {
    // Clean up any subscriptions
  },
  methods: {
    async loadProjects() {
      this.isLoading = true;
      try {
        this.projects = await projectService.getProjects();
      } catch (error) {
        console.error('Failed to load projects:', error);
        toastService.error('Failed to load projects');
      } finally {
        this.isLoading = false;
      }
    },

    async refreshProjects() {
      await this.loadProjects();
      toastService.success('Projects refreshed');
    },

    openCreateModal() {
      this.isEditing = false;
      this.currentProjectId = null;
      this.resetForm();
      this.showModal = true;
    },

    editProject(project) {
      this.isEditing = true;
      this.currentProjectId = project.id;
      this.formData = {
        title: project.title,
        description: project.description || '',
        status: project.status,
        priority: project.priority,
        progress: project.progress || 0
      };
      this.showModal = true;
    },

    async saveProject() {
      if (this.isLoading || !this.isFormValid) return;

      // Validate form
      if (!this.validateForm()) {
        toastService.error('Please fix the errors before saving');
        return;
      }

      this.isLoading = true;
      try {
        // Check authentication
        const user = await this.checkAuthentication();
        if (!user) return;

        if (this.isEditing) {
          await projectService.updateProject(this.currentProjectId, this.formData);
          toastService.success('Project updated successfully');
        } else {
          await projectService.createProject(this.formData);
          toastService.success('Project created successfully');
        }
        this.closeModal();
        await this.loadProjects();
      } catch (error) {
        console.error('Failed to save project:', error);
        this.handleSaveError(error);
      } finally {
        this.isLoading = false;
      }
    },

    validateForm() {
      this.errors = {};
      
      if (!this.formData.title.trim()) {
        this.errors.title = 'Project title is required';
        return false;
      }
      
      if (this.formData.title.trim().length < 2) {
        this.errors.title = 'Project title must be at least 2 characters';
        return false;
      }
      
      if (this.formData.description && this.formData.description.length > 500) {
        this.errors.description = 'Description cannot exceed 500 characters';
        return false;
      }
      
      return true;
    },

    async checkAuthentication() {
      const user = await new Promise((resolve) => {
        const checkAuth = () => {
          if (window.firebase && window.firebase.auth) {
            const currentUser = window.firebase.auth.currentUser;
            if (currentUser) {
              resolve(currentUser);
            } else {
              // Wait for auth state change
              window.firebase.auth.onAuthStateChanged((user) => {
                resolve(user);
              });
            }
          } else {
            // Fallback check after a short delay
            setTimeout(() => {
              const currentUser = window.firebase?.auth?.currentUser;
              resolve(currentUser);
            }, 100);
          }
        };
        checkAuth();
      });

      if (!user) {
        toastService.error('Please log in to create projects');
        return null;
      }

      return user;
    },

    handleSaveError(error) {
      let errorMessage = 'Failed to save project';
      
      if (error.code) {
        switch (error.code) {
          case 'permission-denied':
            errorMessage = 'You do not have permission to save this project';
            break;
          case 'not-found':
            errorMessage = 'Project not found';
            break;
          case 'already-exists':
            errorMessage = 'A project with this name already exists';
            break;
          case 'unavailable':
            errorMessage = 'Service temporarily unavailable. Please try again.';
            break;
          default:
            errorMessage = `Error: ${error.message || 'Unknown error occurred'}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toastService.error(errorMessage);
    },

    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field];
      }
    },

    async deleteProject(project) {
      if (this.isLoading) return;

      const confirmed = confirm(`Are you sure you want to delete "${project.title}"?`);
      if (!confirmed) return;

      this.isLoading = true;
      try {
        await projectService.deleteProject(project.id);
        toastService.success('Project deleted successfully');
        await this.loadProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
        toastService.error('Failed to delete project');
      } finally {
        this.isLoading = false;
      }
    },

    async updateProgress(project) {
      const newProgress = prompt('Enter new progress (0-100):', project.progress);
      if (newProgress === null) return; // User cancelled

      const progress = parseInt(newProgress);
      if (isNaN(progress) || progress < 0 || progress > 100) {
        toastService.error('Please enter a valid progress value (0-100)');
        return;
      }

      this.isLoading = true;
      try {
        await projectService.updateProjectProgress(project.id, progress);
        toastService.success('Progress updated successfully');
        await this.loadProjects();
      } catch (error) {
        console.error('Failed to update progress:', error);
        toastService.error('Failed to update progress');
      } finally {
        this.isLoading = false;
      }
    },

    closeModal() {
      this.showModal = false;
      this.resetForm();
    },

    resetForm() {
      this.formData = {
        title: '',
        description: '',
        status: 'active',
        priority: 'medium',
        progress: 0
      };
    },

    setFilter(type, value) {
      this.activeFilters[type] = value;
    },

    handleSearch() {
      // Search is handled by computed property
    },

    formatDate(timestamp) {
      if (!timestamp) return 'N/A';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString();
    },

    setupParticles() {
      try {
        const container = this.$el;
        if (!container) return;
        const particles = container.querySelectorAll('.particles .particle');
        particles.forEach((p) => {
          const dx = (Math.random() * 100 - 50).toFixed(2) + 'px';
          const dy = (Math.random() * 80 - 40).toFixed(2) + 'px';
          const dur = (8 + Math.random() * 12).toFixed(2) + 's';
          const delay = (-Math.random() * 10).toFixed(2) + 's';
          const size = (2 + Math.random() * 8).toFixed(2) + 'px';
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
          p.style.opacity = (0.1 + Math.random() * 0.6).toString();
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

    handleWheel(event) {
      // Only apply on mobile/tablet screens
      if (window.innerWidth > 768) return;
      
      event.preventDefault();
      const container = this.$refs.cardsContainer;
      if (!container) return;
      
      // Scroll 25% of container width
      const scrollAmount = container.offsetWidth * 0.25;
      
      if (event.deltaY > 0) {
        // Scroll right
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else {
        // Scroll left
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    },

    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
    },

    handleTouchMove(event) {
      this.touchEndX = event.touches[0].clientX;
    },

    handleTouchEnd() {
      // Only apply on mobile/tablet screens
      if (window.innerWidth > 768) return;
      
      const container = this.$refs.cardsContainer;
      if (!container) return;
      
      const swipeThreshold = 50; // minimum swipe distance
      const diff = this.touchStartX - this.touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        // Scroll 25% of container width
        const scrollAmount = container.offsetWidth * 0.25;
        
        if (diff > 0) {
          // Swiped left, scroll right
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        } else {
          // Swiped right, scroll left
          container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      }
      
      // Reset touch positions
      this.touchStartX = 0;
      this.touchEndX = 0;
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
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float var(--dur, 10s) linear infinite;
}

@keyframes float {
  0% { 
    opacity: 0; 
    transform: translateY(0px) translateX(0px) scale(1); 
  }
  25% { 
    opacity: 1; 
    transform: translateY(-20px) translateX(10px) scale(1.1); 
  }
  50% { 
    opacity: 0.8; 
    transform: translateY(-30px) translateX(-5px) scale(0.9); 
  }
  75% { 
    opacity: 1; 
    transform: translateY(-15px) translateX(15px) scale(1.05); 
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

.orb-4 {
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%);
  top: 40%;
  right: 10%;
  animation-delay: 7s;
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
  position: relative;
  overflow: hidden;
}

.liquid-glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.liquid-glass-card:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.liquid-glass-btn {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.liquid-glass-btn:hover {
  background: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
}

.liquid-glass-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.liquid-glass-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  width: 100%;
  transition: all 0.3s ease;
}

.liquid-glass-input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.liquid-glass-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.main-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Header Section */
.project-header {
  padding: 32px;
  margin-top: 120px;
  width: 100%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.header-text h1 {
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-icon {
  font-size: 18px;
}

/* Filters Section */
.filters-section {
  padding: 24px;
  width: 100%;
}

.filters-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-label {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  min-width: 80px;
}

.filter-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.filter-btn.active {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
  color: white;
}

.search-group {
  display: flex;
  justify-content: flex-end;
}

.search-input {
  max-width: 300px;
}

/* Horizontal Scrolling Cards Section */
.cards-section-wrapper {
  width: 100%;
  margin-bottom: 32px;
  overflow: hidden;
}

.cards-container {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 8px 4px 20px 4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.cards-container::-webkit-scrollbar {
  height: 6px;
}

.cards-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.cards-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.cards-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.nav-card {
  min-width: 280px;
  max-width: 280px;
  padding: 28px 24px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-card:hover {
  transform: translateY(-4px) scale(1.02);
}

.nav-card-icon {
  font-size: 48px;
  margin-bottom: 8px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.nav-card-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: white;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-card-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.4;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
  width: 100%;
  margin-bottom: 50px;
}

.project-card {
  padding: 24px;
  height: fit-content;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.project-info {
  flex: 1;
}

.project-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
}

.project-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
}

.project-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 600;
  min-width: 60px;
}

.status-badge, .priority-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-active { background: rgba(16, 185, 129, 0.2); color: #10b981; }
.status-planning { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.status-on-hold { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
.status-completed { background: rgba(139, 92, 246, 0.2); color: #8b5cf6; }

.priority-low { background: rgba(107, 114, 128, 0.2); color: #6b7280; }
.priority-medium { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.priority-high { background: rgba(251, 146, 60, 0.2); color: #fb923c; }
.priority-urgent { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

.progress-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.3s ease;
  border-radius: 20px;
}

.progress-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 600;
  min-width: 35px;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.project-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value {
  color: white;
  font-weight: 700;
  font-size: 16px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress-btn {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.progress-btn:hover {
  background: rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
}

/* Empty State */
.empty-state {
  padding: 60px 40px;
  text-align: center;
  grid-column: 1 / -1;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
}

.empty-text {
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.empty-action-btn {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.empty-action-btn:hover {
  background: rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
}

/* Modal Animation Styles */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.modal-slide-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.modal-slide-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: modalOverlayFadeIn 0.3s ease-out;
}

.modal-content {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalContentSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalOverlayFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalContentSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
}

.project-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  font-size: 14px;
}

.form-input, .form-textarea, .form-select {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: white;
  padding: 14px 18px;
  border-radius: 14px;
  transition: all 0.3s ease;
  font-size: 14px;
  line-height: 1.4;
  margin-top: 4px;
  position: relative;
}

.form-input.error, .form-textarea.error, .form-select.error {
  border-color: rgba(239, 68, 68, 0.6);
  background: rgba(239, 68, 68, 0.05);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input.error:focus, .form-textarea.error:focus, .form-select.error:focus {
  border-color: rgba(239, 68, 68, 0.8);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.error-message {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.char-count {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  text-align: right;
  margin-top: 4px;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-select option {
  background: #1a1a1a;
  color: white;
}

.form-range {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  outline: none;
  -webkit-appearance: none;
}

.form-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.form-range::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-btn, .save-btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: rgba(107, 114, 128, 0.2);
  border: 1px solid rgba(107, 114, 128, 0.3);
  color: rgba(255, 255, 255, 0.8);
}

.cancel-btn:hover {
  background: rgba(107, 114, 128, 0.3);
  color: white;
}

.save-btn {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: white;
}

.save-btn:hover {
  background: rgba(16, 185, 129, 0.3);
  transform: translateY(-1px);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.loading-spinner {
  padding: 40px;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  transition: all 0.3s ease;
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
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  /* Mobile optimizations for navigation cards */
  .cards-container {
    gap: 16px;
    padding: 8px 2px 16px 2px;
  }

  .nav-card {
    min-width: 240px;
    max-width: 240px;
    padding: 24px 20px;
  }

  .nav-card-icon {
    font-size: 40px;
  }

  .nav-card-title {
    font-size: 20px;
  }

  .nav-card-description {
    font-size: 13px;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .project-card {
    padding: 20px;
  }

  .filters-content {
    gap: 12px;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .filter-buttons {
    justify-content: center;
  }

  .search-group {
    justify-content: center;
  }

  .search-input {
    max-width: none;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-content {
    margin: 10px;
    max-height: calc(100vh - 20px);
  }
}

@media (max-width: 480px) {
  .project-header, .filters-section {
    padding: 20px;
    margin-top: 100px;
  }

  /* Extra small screens - smaller navigation cards */
  .nav-card {
    min-width: 200px;
    max-width: 200px;
    padding: 20px 16px;
  }

  .nav-card-icon {
    font-size: 36px;
  }

  .nav-card-title {
    font-size: 18px;
  }

  .nav-card-description {
    font-size: 12px;
  }

  .project-card {
    padding: 16px;
  }

  .project-stats {
    flex-direction: column;
    gap: 8px;
  }

  .project-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
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