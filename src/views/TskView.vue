<template>
  <div class="tsk-container relative w-full h-screen flex flex-col overflow-hidden text-white font-sans">
    <UniversalBanner />

    <!-- BOX LETTERS HEADER -->
    <header class="relative z-50 pt-24 md:pt-32 w-full max-w-2xl px-6 mx-auto flex flex-col items-center">
      <div class="flex justify-center mb-8 md:mb-12">
        <div class="flex gap-2">
          <div v-for="char in 'TSK'" :key="char" class="box-letter">
            {{ char }}
          </div>
        </div>
      </div>

      <!-- ENHANCED TASK INPUT (The "Directive" Fix) -->
      <div class="box-task-input group relative w-full mb-8">
        <div class="absolute inset-0 bg-white/5 blur-xl group-focus-within:bg-white/10 transition-all"></div>
        <div class="relative flex flex-col bg-black/40 border-2 border-white/10 rounded-2xl p-4 transition-all focus-within:border-white/40 backdrop-blur-xl">
          <div class="flex items-center gap-4 mb-4">
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
      class="flex-1 relative cursor-crosshair m-4 mb-24 overflow-hidden touch-none"
      @mousedown.self="startPan"
      @mousemove="onMouseMove"
      @mouseup="stopInteraction"
      @mouseleave="stopInteraction"
      @touchstart.self="startPanTouch"
      @touchmove="onMouseMoveTouch"
      @touchend="stopInteraction"
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
          <div class="relative z-10 p-2 md:p-4 min-w-[140px] md:min-w-[200px] max-w-[180px] md:max-w-[260px]">
            <!-- Protocol Header -->
            <div class="flex justify-between items-start mb-2 text-[7px] md:text-[9px]">
              <span class="font-black opacity-30 tracking-[0.2em] uppercase">Protocol #{{ index + 1 }}</span>
              <button @click.stop="toggleTask(task)" class="w-3.5 h-3.5 md:w-4 md:h-4 rounded-sm border border-white/20 flex items-center justify-center hover:border-white transition-colors">
                <svg v-if="task.completed" class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
              </button>
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
              <button @click.stop="deleteTask(task.id)" class="text-white/30 hover:text-white transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>

          <!-- Glass Effect & Border -->
          <div class="absolute inset-0 bg-white/[0.02] backdrop-blur-xl rounded-lg md:rounded-xl border border-white/10 group-hover:border-white/40 shadow-2xl transition-all overflow-hidden">
            <!-- Animated Border Fill -->
            <div class="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-all duration-500"></div>
            <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-border-flow"></div>
          </div>
          <div class="absolute -inset-0.5 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[10px] md:rounded-[14px] blur-md"></div>
        </div>
      </div>
    </main>

    <!-- FOOTER NAV -->
    <footer class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 p-2 bg-black/40 border border-white/10 rounded-full backdrop-blur-2xl whitespace-nowrap">
      <button @click="backToCollection" class="px-4 md:px-6 py-2 rounded-full hover:bg-white/10 transition-colors text-[10px] md:text-xs font-bold tracking-widest uppercase">
        Collection
      </button>
      <div class="w-px h-4 bg-white/10"></div>
      <div class="px-4 md:px-6 py-2 text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/30">
        {{ tasks.length }} Tasks
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
      errorMessage: null,
      draggingTaskId: null,
      offset: { x: 0, y: 0 },
      pan: { x: 0, y: 0 },
      isPanning: false,
      physicsLoop: null,
      repulsionStrength: 40,
      repulsionRadius: 200,
      damping: 0.85,
      fieldBounds: { width: 4000, height: 4000 }
    };
  },
  computed: {
    backgroundStyle() {
      return {
        backgroundPosition: `${this.pan.x}px ${this.pan.y}px`,
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
        backgroundSize: '30px 30px'
      };
    },
    isMobile() {
      return typeof window !== 'undefined' && window.innerWidth < 768;
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
            x: data.x ?? (Math.random() - 0.5) * 800,
            y: data.y ?? (Math.random() - 0.5) * 800,
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

    async deleteTask(taskId) {
      await deleteDoc(doc(db, 'tasks', taskId));
    },

    startPhysics() {
      const update = () => {
        const fieldRect = this.$refs.field?.getBoundingClientRect() || { width: 0, height: 0 };
        const h = fieldRect.height;
        const w = fieldRect.width;

        // Repulsion
        for (let i = 0; i < this.tasks.length; i++) {
          for (let j = i + 1; j < this.tasks.length; j++) {
            const t1 = this.tasks[i];
            const t2 = this.tasks[j];
            const dx = t1.x - t2.x;
            const dy = t1.y - t2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            const radius = this.isMobile ? 140 : 220;
            if (dist < radius && dist > 0) {
              const force = (radius - dist) / radius;
              const fx = (dx / dist) * force * this.repulsionStrength;
              const fy = (dy / dist) * force * this.repulsionStrength;
              if (t1.id !== this.draggingTaskId) { t1.vx += fx; t1.vy += fy; }
              if (t2.id !== this.draggingTaskId) { t2.vx -= fx; t2.vy -= fy; }
            }
          }
        }

        // Apply velocity & boundaries
        this.tasks.forEach(task => {
          if (task.id === this.draggingTaskId) return;
          task.x += task.vx;
          task.y += task.vy;
          task.vx *= this.damping;
          task.vy *= this.damping;
          
          const halfW = this.isMobile ? 90 : 130;
          const halfH = this.isMobile ? 70 : 100;

          // Header safety margin: keep tasks below the input area
          const headerLimit = -h/2 + 150; 

          if (task.y + this.pan.y - halfH < headerLimit) {
              task.y = headerLimit - this.pan.y + halfH;
              task.vy = Math.abs(task.vy) * 0.3;
          }
          if (task.y + this.pan.y + halfH > h / 2) {
              task.y = h / 2 - this.pan.y - halfH;
              task.vy = -Math.abs(task.vy) * 0.3;
          }
          if (task.x + this.pan.x - halfW < -w / 2) {
              task.x = -w / 2 - this.pan.x + halfW;
              task.vx = Math.abs(task.vx) * 0.3;
          }
          if (task.x + this.pan.x + halfW > w / 2) {
              task.x = w / 2 - this.pan.x - halfW;
              task.vx = -Math.abs(task.vx) * 0.3;
          }
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
      this.offset = { x: e.clientX - this.pan.x, y: e.clientY - this.pan.y };
    },
    onMouseMove(e) {
      const rect = this.$refs.field.getBoundingClientRect();
      if (this.draggingTaskId) {
        const task = this.tasks.find(t => t.id === this.draggingTaskId);
        if (task) {
          task.x = e.clientX - rect.left - this.offset.x - this.pan.x - rect.width / 2;
          task.y = e.clientY - rect.top - this.offset.y - this.pan.y - rect.height / 2;
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
      const touch = e.touches[0];
      const rect = this.$refs.field.getBoundingClientRect();
      if (this.draggingTaskId) {
        const task = this.tasks.find(t => t.id === this.draggingTaskId);
        if (task) {
          task.x = touch.clientX - rect.left - this.offset.x - this.pan.x - rect.width / 2;
          task.y = touch.clientY - rect.top - this.offset.y - this.pan.y - rect.height / 2;
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
      const halfW = this.isMobile ? 90 : 130;
      const halfH = this.isMobile ? 70 : 100;
      return {
        left: '50%',
        top: '50%',
        transform: `translate(${task.x + this.pan.x - halfW}px, ${task.y + this.pan.y - halfH}px)`,
        zIndex: this.draggingTaskId === task.id ? 100 : 10
      };
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

.box-letter {
  width: 40px;
  height: 40px;
  background: white;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 900;
  border-radius: 8px;
  box-shadow: 0 6px 0 #cbd5e1;
  transform: rotate(-3deg);
  transition: all 0.3s;
}

@media (min-width: 768px) {
  .box-letter {
    width: 60px;
    height: 60px;
    font-size: 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 0 #cbd5e1;
  }
}

.box-letter:hover {
  transform: translateY(-5px) rotate(0deg);
  box-shadow: 0 15px 0 #cbd5e1;
}

.box-letter:nth-child(even) {
  transform: rotate(3deg);
}

.task-box {
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1);
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
</style>