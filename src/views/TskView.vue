<template>
  <div class="tsk-container relative w-full h-screen flex flex-col overflow-hidden text-white font-sans">
    <UniversalBanner />

    <!-- HEADER -->
    <header class="relative z-50 pt-20 md:pt-24 w-full max-w-2xl px-6 mx-auto flex flex-col items-center safe-top">
      <!-- ENHANCED TASK INPUT -->
      <div class="box-task-input group relative w-full mb-6">
        <div class="absolute inset-0 bg-white/5 blur-xl group-focus-within:bg-white/10 transition-all"></div>
        <div class="relative flex flex-col bg-black/40 border-2 border-white/10 rounded-2xl p-3 md:p-4 transition-all focus-within:border-white/40 backdrop-blur-xl">
          <div class="flex items-center gap-3 md:gap-4" :class="{'mb-4': isAddingExpanded}">
            <input 
              v-model="form.title" 
              @keyup.enter="addTask"
              @focus="isAddingExpanded = true"
              placeholder="ADD NEW DIRECTIVE..." 
              class="flex-1 bg-transparent border-none outline-none px-2 py-1 text-sm md:text-lg font-bold tracking-widest placeholder:text-white/20"
            />
            <button 
              @click="addTask" 
              :disabled="isUploading"
              class="bg-white text-black font-black px-4 md:px-6 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              <span v-if="!isUploading">+</span>
              <svg v-else class="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>

          <!-- Expanded Form Fields -->
          <transition name="expand">
            <div v-if="isAddingExpanded" class="space-y-4 pt-4 border-t border-white/10">
              <textarea 
                v-model="form.description" 
                placeholder="Description / Details..."
                class="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs md:text-sm outline-none focus:border-white/30 transition-colors resize-none h-20"
              ></textarea>
              
              <div class="flex flex-wrap gap-4 items-center">
                <!-- Date Picker -->
                <div class="flex-1 min-w-[150px]">
                  <label class="block text-[8px] md:text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Plan Date</label>
                  <input 
                    type="date" 
                    v-model="form.planDate"
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                <!-- Media Upload -->
                <div class="flex-1 min-w-[150px]">
                  <label class="block text-[8px] md:text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Attachment</label>
                  <div class="relative overflow-hidden group/file">
                    <input 
                      type="file" 
                      accept="image/*"
                      capture="environment"
                      @change="handleFileChange"
                      class="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs flex items-center justify-between group-hover/file:border-white/30 transition-colors">
                      <span class="truncate opacity-60">{{ form.fileName || 'Attach Image / Camera' }}</span>
                      <svg class="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Error Message Display -->
              <div v-if="errorMessage" class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] md:text-xs">
                {{ errorMessage }}
                <p v-if="errorMessage.includes('CORS')" class="mt-1 opacity-80">
                  Note: Please ensure Firebase Storage CORS is configured for localhost.
                </p>
              </div>

              <div class="flex justify-end gap-2 pt-2">
                <button 
                  v-if="!isUploading"
                  @click="resetForm" 
                  class="text-[10px] font-bold opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </header>

    <!-- TASK FIELD (BIG MOVABLE AREA) -->
    <main 
      ref="field"
      class="flex-1 relative cursor-crosshair m-2 md:m-4 mb-32 md:mb-24 overflow-hidden touch-none -mt-6 md:-mt-10"
      @mousedown.self="startPan"
      @mousemove="onMouseMove"
      @mouseup="stopInteraction"
      @mouseleave="stopInteraction"
      @touchstart.self="startPanTouch"
      @touchmove="onMouseMoveTouch"
      @touchend="stopInteraction"
      @wheel="handleWheel"
    >
      <!-- Task Field Background Grid -->
      <div class="absolute inset-0 opacity-10 pointer-events-none" :style="backgroundStyle"></div>

      <!-- Draggable Tasks -->
      <div 
        v-for="(task, index) in tasks" 
        :key="task.id"
        class="absolute cursor-grab active:cursor-grabbing"
        :class="{'transition-transform duration-300 ease-out': draggingTaskId !== task.id}"
        :style="getTaskStyle(task)"
        @mousedown.stop="startDragTask($event, task)"
        @touchstart.stop="startDragTaskTouch($event, task)"
      >
        <div 
          class="task-box group"
          :class="{'completed': task.completed, 'dragging': draggingTaskId === task.id}"
        >
          <!-- Task Content -->
          <div class="relative z-10 p-2 md:p-4 min-w-[130px] md:min-w-[200px] max-w-[160px] md:max-w-[260px]">
            <!-- Protocol Header -->
            <div class="flex justify-between items-start mb-2 text-[7px] md:text-[9px]">
              <span class="font-black opacity-30 tracking-[0.2em] uppercase">Protocol #{{ index + 1 }}</span>
              <div class="flex items-center gap-2">
                <!-- Progress Counter -->
                <div class="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                  <button @click.stop="incrementCount(task)" class="w-3.5 h-3.5 md:w-4 md:h-4 rounded-sm bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95">
                    <span class="text-white font-bold text-[10px] md:text-xs">+</span>
                  </button>
                  <span class="text-[9px] md:text-[10px] font-mono font-bold text-white/60">{{ task.count || 0 }}</span>
                </div>
                <!-- Completion Checkbox -->
                <button @click.stop="toggleTask(task)" class="w-3.5 h-3.5 md:w-4 md:h-4 rounded-sm border border-white/20 flex items-center justify-center hover:border-white transition-colors">
                  <svg v-if="task.completed" class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                </button>
              </div>
            </div>
            
            <!-- Image Attachment if exists -->
            <div v-if="task.imageUrl" class="w-full h-24 md:h-32 mb-3 rounded-lg overflow-hidden border border-white/10 bg-black/20">
              <img :src="task.imageUrl" class="w-full h-full object-cover" loading="lazy" />
            </div>

            <!-- Title & Description -->
            <h3 class="font-bold text-xs md:text-base mb-1 group-hover:text-white transition-colors leading-tight" :class="{'line-through opacity-50': task.completed}">
              {{ task.title }}
            </h3>
            <p v-if="task.description" class="text-[9px] md:text-xs text-white/40 line-clamp-2 md:line-clamp-3 mb-3 leading-relaxed">{{ task.description }}</p>

            <!-- Plan Date Badge -->
            <div v-if="task.planDate" class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 mb-3">
              <svg class="w-2.5 h-2.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span class="text-[8px] md:text-[10px] opacity-60 font-mono">{{ task.planDate }}</span>
            </div>

            <!-- Footer Stats -->
            <div class="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="text-[7px] md:text-[9px] text-white/20 font-mono">{{ formatDate(task.createdAt) }}</span>
              <button @click.stop="showDeleteConfirm(task.id)" class="text-white/30 hover:text-red-400 transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>

          <!-- Glass Effect & Border -->
          <div class="absolute inset-0 bg-white/[0.03] backdrop-blur-2xl rounded-lg md:rounded-xl border border-white/10 group-hover:border-white/40 shadow-2xl transition-all overflow-hidden tsk-card-glass">
            <!-- Animated Border Fill -->
            <div class="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-all duration-500"></div>
            <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-border-flow"></div>
          </div>
          <div class="absolute -inset-1 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[12px] md:rounded-[16px] blur-xl"></div>
        </div>
      </div>
    </main>

    <!-- FOOTER NAV -->
    <footer class="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 p-2 bg-black/40 border border-white/10 rounded-full backdrop-blur-2xl whitespace-nowrap">
      <!-- TSK Letters -->
      <div class="flex gap-1.5 px-2">
        <div v-for="char in 'TSK'" :key="char" class="box-letter-footer">
          {{ char }}
        </div>
      </div>
      <div class="w-px h-4 bg-white/10"></div>
      <button @click="backToCollection" class="px-4 md:px-6 py-2 rounded-full hover:bg-white/10 transition-colors text-[10px] md:text-xs font-bold tracking-widest uppercase">
        Collection
      </button>
      <div class="w-px h-4 bg-white/10"></div>
      <button 
        v-if="completedCount > 0"
        @click="archiveCompleted" 
        :disabled="isArchiving"
        class="px-4 md:px-6 py-2 rounded-full hover:bg-green-500/20 transition-all text-[10px] md:text-xs font-bold tracking-widest uppercase text-green-400/80 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg v-if="!isArchiving" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
        <svg v-else class="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        {{ isArchiving ? 'Archiving...' : `Archive (${completedCount})` }}
      </button>
      <div v-if="completedCount > 0" class="w-px h-4 bg-white/10"></div>
      <div class="px-4 md:px-6 py-2 text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/30">
        {{ tasks.length }} Tasks
      </div>
    </footer>

    <!-- DELETE CONFIRMATION MODAL -->
    <transition name="modal-fade">
      <div v-if="deleteConfirmId" @click="cancelDelete" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div @click.stop class="bg-black/80 border-2 border-red-500/30 rounded-2xl p-6 md:p-8 max-w-sm mx-4 backdrop-blur-xl shadow-2xl transform transition-all">
          <div class="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20">
            <svg class="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          
          <h3 class="text-lg md:text-xl font-black text-center mb-2 text-white">Delete Task?</h3>
          <p class="text-sm md:text-base text-white/60 text-center mb-6">Are you sure you want to permanently delete this task? This action cannot be undone.</p>
          
          <div class="flex gap-3">
            <button 
              @click="cancelDelete" 
              class="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-sm transition-all hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button 
              @click="confirmDelete" 
              class="flex-1 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 font-bold text-sm text-red-400 transition-all hover:scale-105 active:scale-95"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </transition>
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
        fileName: ''
      },
      mediaFile: null,
      isAddingExpanded: false,
      isUploading: false,
      isArchiving: false,
      deleteConfirmId: null,
      errorMessage: null,
      draggingTaskId: null,
      offset: { x: 0, y: 0 },
      pan: { x: 0, y: 0 },
      isPanning: false,
      physicsLoop: null,
      repulsionStrength: 8, // Very low repulsion to help spreading without chaos
      repulsionRadius: 180,
      damping: 0.95,
      fieldBounds: { width: 4000, height: 4000 },
      zoom: 1,
      minZoom: 0.15, // Allow zooming out much further
      maxZoom: 3,    // Allow zooming in more
      lastPinchDist: 0
    };
  },
  computed: {
    backgroundStyle() {
      const gSize = 40 * this.zoom;
      return {
        backgroundPosition: `${this.pan.x}px ${this.pan.y}px`,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: `${gSize}px ${gSize}px`
      };
    },
    isMobile() {
      return typeof window !== 'undefined' && window.innerWidth < 768;
    },
    completedCount() {
      return this.tasks.filter(t => t.completed).length;
    }
  },
  mounted() {
    this.loadTasks();
    this.startPhysics();
    this.centerField();
  },
  beforeUnmount() {
    if (this.physicsLoop) cancelAnimationFrame(this.physicsLoop);
  },
  methods: {
    centerField() {
      this.pan.x = 0;
      this.pan.y = 0;
    },
    loadTasks() {
      if (!auth.currentUser) return;
      const q = query(collection(db, 'tasks'), where('userId', '==', auth.currentUser.uid));
      onSnapshot(q, (snapshot) => {
        const newTasks = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            x: data.x ?? (Math.random() - 0.5) * 2000, // Wider initial spread
            y: data.y ?? (Math.random() - 0.5) * 1500,
            vx: 0,
            vy: 0
          };
        }).filter(t => !t.archived);
        
        this.tasks = newTasks.map(nt => {
          const old = this.tasks.find(o => o.id === nt.id);
          if (old && nt.id !== this.draggingTaskId) {
            return { ...nt, vx: old.vx, vy: old.vy };
          }
          return nt;
        });
      });
    },

    handleFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.mediaFile = file;
        this.form.fileName = file.name;
      }
    },

    resetForm() {
      this.form = { title: '', description: '', planDate: '', fileName: '' };
      this.mediaFile = null;
      this.isAddingExpanded = false;
      this.isUploading = false;
      this.errorMessage = null;
    },

    async addTask() {
      if (!this.form.title.trim() || !auth.currentUser || this.isUploading) return;
      
      this.isUploading = true;
      this.errorMessage = null;
      let imageUrl = null;

      try {
        if (this.mediaFile) {
          console.log("Starting file upload...");
          const fileRef = storageRef(storage, `tasks/${auth.currentUser.uid}/${Date.now()}_${this.mediaFile.name}`);
          
          try {
            const snapshot = await uploadBytes(fileRef, this.mediaFile);
            console.log("Upload successful, getting download URL...");
            imageUrl = await getDownloadURL(snapshot.ref);
          } catch (storageError) {
            console.error("Storage Error:", storageError);
            if (storageError.code === 'storage/unauthorized') {
              throw new Error("Unauthorized access to storage. Please check security rules.");
            } else if (storageError.message.includes('CORS')) {
              throw new Error("CORS policy blocked the upload. Firebase Storage needs CORS configuration for localhost.");
            } else {
              throw new Error("Media upload failed: " + storageError.message);
            }
          }
        }

        const newTask = {
          title: this.form.title,
          description: this.form.description || '',
          planDate: this.form.planDate || '',
          imageUrl: imageUrl,
          completed: false,
          archived: false,
          count: 0,
          userId: auth.currentUser.uid,
          createdAt: new Date(),
          x: -this.pan.x + (Math.random() - 0.5) * 100,
          y: -this.pan.y + (Math.random() - 0.5) * 100,
          vx: 0,
          vy: 0
        };

        console.log("Adding task to Firestore...");
        await addDoc(collection(db, 'tasks'), newTask);
        this.resetForm();
      } catch (error) {
        console.error("Error adding task:", error);
        this.errorMessage = error.message || "An unexpected error occurred.";
      } finally {
        this.isUploading = false;
      }
    },

    async toggleTask(task) {
      await updateDoc(doc(db, 'tasks', task.id), { completed: !task.completed });
    },

    async incrementCount(task) {
      const newCount = (task.count || 0) + 1;
      await updateDoc(doc(db, 'tasks', task.id), { count: newCount });
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

    async deleteTask(taskId) {
      await deleteDoc(doc(db, 'tasks', taskId));
    },

    async archiveCompleted() {
      if (this.isArchiving) return;
      
      this.isArchiving = true;
      try {
        const completedTasks = this.tasks.filter(t => t.completed);
        const updatePromises = completedTasks.map(task => 
          updateDoc(doc(db, 'tasks', task.id), { archived: true })
        );
        await Promise.all(updatePromises);
        console.log(`Archived ${completedTasks.length} completed task(s)`);
      } catch (error) {
        console.error('Error archiving tasks:', error);
      } finally {
        this.isArchiving = false;
      }
    },

    startPhysics() {
      const update = () => {
        // Subtle repulsion to help spread
        if (this.repulsionStrength > 0) {
          for (let i = 0; i < this.tasks.length; i++) {
            for (let j = i + 1; j < this.tasks.length; j++) {
              const t1 = this.tasks[i];
              const t2 = this.tasks[j];
              const dx = t1.x - t2.x;
              const dy = t1.y - t2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const radius = this.repulsionRadius;
              if (dist < radius && dist > 0) {
                const force = (radius - dist) / radius;
                const fx = (dx / dist) * force * this.repulsionStrength;
                const fy = (dy / dist) * force * this.repulsionStrength;
                if (t1.id !== this.draggingTaskId) { t1.vx += fx; t1.vy += fy; }
                if (t2.id !== this.draggingTaskId) { t2.vx -= fx; t2.vy -= fy; }
              }
            }
          }
        }

        // Apply velocity & boundaries (Absolute Field Space)
        this.tasks.forEach(task => {
          if (task.id === this.draggingTaskId) return;
          task.x += task.vx;
          task.y += task.vy;
          task.vx *= this.damping;
          task.vy *= this.damping;
          
          // Infinite field: no hard boundaries as requested
          // Tasks can live anywhere in the coordinate space
        });
        this.physicsLoop = requestAnimationFrame(update);
      };
      this.physicsLoop = requestAnimationFrame(update);
    },

    // DESKTOP INTERACTION
    startDragTask(e, task) {
      this.draggingTaskId = task.id;
      const rect = this.$refs.field.getBoundingClientRect();
      this.offset = {
        x: e.clientX - rect.left - (task.x + this.pan.x + rect.width / 2),
        y: e.clientY - rect.top - (task.y + this.pan.y + rect.height / 2)
      };
    },
    startPan(e) {
      if (this.isAddingExpanded) return;
      this.isPanning = true;
      // Record starting position for smooth offset
      this.offset = { x: e.clientX - this.pan.x, y: e.clientY - this.pan.y };
    },
    onMouseMove(e) {
      const rect = this.$refs.field.getBoundingClientRect();
      if (this.draggingTaskId) {
        const task = this.tasks.find(t => t.id === this.draggingTaskId);
        if (task) {
          // World coordinates calculation
          task.x = (e.clientX - rect.left - rect.width / 2 - this.pan.x) / this.zoom;
          task.y = (e.clientY - rect.top - rect.height / 2 - this.pan.y) / this.zoom;
          task.vx = task.vy = 0;
        }
      } else if (this.isPanning) {
        this.pan.x = e.clientX - this.offset.x;
        this.pan.y = e.clientY - this.offset.y;
      }
    },

    // TOUCH INTERACTION (Mobile)
    startDragTaskTouch(e, task) {
      const touch = e.touches[0];
      this.draggingTaskId = task.id;
      const rect = this.$refs.field.getBoundingClientRect();
      this.offset = {
        x: touch.clientX - rect.left - (task.x + this.pan.x + rect.width / 2),
        y: touch.clientY - rect.top - (task.y + this.pan.y + rect.height / 2)
      };
    },
    startPanTouch(e) {
      if (this.isAddingExpanded) return;
      const touch = e.touches[0];
      this.isPanning = true;
      this.offset = { x: touch.clientX - this.pan.x, y: touch.clientY - this.pan.y };
    },
    onMouseMoveTouch(e) {
      if (e.touches.length === 2) {
        this.handlePinch(e);
        return;
      }
      const touch = e.touches[0];
      const rect = this.$refs.field.getBoundingClientRect();
      if (this.draggingTaskId) {
        const task = this.tasks.find(t => t.id === this.draggingTaskId);
        if (task) {
          // World coordinates calculation
          task.x = (touch.clientX - rect.left - rect.width / 2 - this.pan.x) / this.zoom;
          task.y = (touch.clientY - rect.top - rect.height / 2 - this.pan.y) / this.zoom;
          task.vx = task.vy = 0;
        }
      } else if (this.isPanning) {
        this.pan.x = touch.clientX - this.offset.x;
        this.pan.y = touch.clientY - this.offset.y;
      }
    },

    async stopInteraction() {
      if (this.draggingTaskId) {
        const task = this.tasks.find(t => t.id === this.draggingTaskId);
        if (task) await updateDoc(doc(db, 'tasks', task.id), { x: task.x, y: task.y });
        this.draggingTaskId = null;
      }
      this.isPanning = false;
    },

    getTaskStyle(task) {
      const x = (task.x * this.zoom) + this.pan.x;
      const y = (task.y * this.zoom) + this.pan.y;
      
      return {
        left: '50%',
        top: '50%',
        transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${this.zoom})`,
        zIndex: this.draggingTaskId === task.id ? 100 : 10,
        transition: this.draggingTaskId === task.id ? 'none' : 'transform 0.15s linear'
      };
    },
    handleWheel(e) {
      e.preventDefault();
      const zoomSpeed = 0.0015;
      const delta = -e.deltaY * zoomSpeed * this.zoom; // Exponential zoom for better feel
      const newZoom = Math.min(Math.max(this.zoom + delta, this.minZoom), this.maxZoom);
      this.zoom = newZoom;
    },
    handlePinch(e) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      
      if (this.lastPinchDist > 0) {
        const delta = (dist - this.lastPinchDist) * 0.005;
        this.zoom = Math.min(Math.max(this.zoom + delta, this.minZoom), this.maxZoom);
      }
      this.lastPinchDist = dist;
    },

    formatDate(date) {
      if (!date) return '';
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    },

    backToCollection() { this.$router.push('/'); }
  }
};
</script>

<style scoped>
.tsk-container {
  background: transparent;
}
.safe-top {
  padding-top: calc(env(safe-area-inset-top, 20px) + 3.5rem);
}
@media (min-width: 768px) {
  .safe-top {
    padding-top: 6rem;
  }
}

.expand-enter-active, .expand-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 400px;
  opacity: 1;
}

.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

.box-letter-footer {
  width: 20px;
  height: 20px;
  background: white;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 900;
  border-radius: 4px;
  box-shadow: 0 2px 0 #cbd5e1;
}

@media (min-width: 768px) {
  .box-letter-footer {
    width: 24px;
    height: 24px;
    font-size: 0.75rem;
    border-radius: 5px;
  }
}

.task-box {
  transition: transform 0.1s linear, box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 140px; 
  backdrop-filter: blur(24px);
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.tsk-card-glass {
  background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%);
  box-shadow: 
    0 4px 24px -1px rgba(0, 0, 0, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.05);
}

.task-box:hover {
  transform: translateY(-5px) rotateX(2deg) rotateY(-2deg);
  box-shadow: 
    0 20px 40px -10px rgba(0, 0, 0, 0.6),
    0 0 20px rgba(255, 255, 255, 0.1);
}

@media (min-width: 768px) {
  .task-box {
    width: auto;
  }
}

.task-box.dragging {
  transform: scale(1.02);
  filter: brightness(1.2);
}

.task-box.completed .absolute.inset-0 {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

@keyframes border-flow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.group:hover .animate-border-flow {
  animation: border-flow 1.5s infinite linear;
}

* {
  user-select: none;
  -webkit-user-drag: none;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  opacity: 0.5;
  cursor: pointer;
}

/* Modal Transitions */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active > div,
.modal-fade-leave-active > div {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from > div {
  transform: scale(0.9);
  opacity: 0;
}

.modal-fade-leave-to > div {
  transform: scale(0.95);
  opacity: 0;
}
</style>