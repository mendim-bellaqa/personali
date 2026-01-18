<template>
  <div class="cyber-container relative w-full h-full"> 
    <!-- Local background layers removed; utilizing global App background -->

    <!-- Universal Banner -->
    <div class="relative z-50 w-full mb-8">
      <UniversalBanner />
    </div>

    <!-- Main Content Wrapper with Prop-driven Parallax -->
    <main class="content-wrapper relative z-10 w-full max-w-5xl mx-auto px-4 pb-24" :style="contentParallaxStyle">
      
      <!-- Main Layout: Split Columns for Desktop -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        <!-- RIGHT COLUMN (Form) -->
        <div class="lg:col-span-4 space-y-4 lg:space-y-6">
          
          <!-- Header Card -->
          <div class="neo-card p-4 lg:p-6 text-center group">
            <h1 class="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tighter mb-1 lg:mb-2 glitch-hover" data-text="TASK_FORCE">
              TASK_FORCE
            </h1>
            <p class="text-[10px] md:text-xs text-cyan-300/60 uppercase tracking-widest">System Ready • 2026</p>
          </div>

          <!-- Add Task Form -->
          <div class="neo-card p-6 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-purple-500"></div>
            
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              INITIALIZE_TASK
            </h2>

            <form @submit.prevent="addTask" class="space-y-4">
              <div class="group">
                <label class="text-[10px] uppercase tracking-wider text-cyan-500/80 mb-1 block">Directive</label>
                <input
                  type="text"
                  v-model="form.title"
                  placeholder="Enter objective..."
                  class="neo-input"
                />
              </div>

              <div class="group">
                <label class="text-[10px] uppercase tracking-wider text-cyan-500/80 mb-1 block">Parameters</label>
                <textarea
                  v-model="form.description"
                  placeholder="Additional data..."
                  rows="3"
                  class="neo-input resize-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] uppercase tracking-wider text-cyan-500/80 mb-1 block">Priority Class</label>
                  <select v-model="form.plan" class="neo-input cursor-pointer">
                    <option value="A">ALPHA (High)</option>
                    <option value="B">BETA (Med)</option>
                    <option value="C">GAMMA (Low)</option>
                  </select>
                </div>
                <div>
                  <label class="text-[10px] uppercase tracking-wider text-cyan-500/80 mb-1 block">Deadline</label>
                  <input
                    type="date"
                    v-model="form.deadline"
                    class="neo-input cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                :disabled="!form.title.trim()"
                class="neo-btn w-full mt-2 group"
                :class="{ 'opacity-50 cursor-not-allowed': !form.title.trim() }"
              >
                <span class="relative z-10 flex items-center justify-center gap-2">
                  <span class="group-hover:tracking-widest transition-all duration-300">EXECUTE</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </span>
                <div class="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
          </div>
          
          <!-- Stats / Mining Mini-view -->
           <div class="neo-card p-4 flex items-center justify-between">
              <span class="text-xs text-blue-300/60 uppercase">Total Efficiency</span>
              <span class="text-xl font-mono font-bold text-cyan-400">{{ totalMiningPoints }} PTS</span>
           </div>
        </div>

        <!-- LEFT COLUMN (Task List) -->
        <div class="lg:col-span-8 flex flex-col h-full">
           <div class="neo-card p-6 min-h-[600px] flex flex-col">
              <div class="flex justify-between items-end mb-6 border-b border-white/5 pb-4">
                 <div>
                    <h3 class="text-2xl font-bold text-white flex items-center gap-3">
                       ACTIVE_PROTOCOLS
                       <span class="px-2 py-0.5 rounded text-xs bg-white/5 text-gray-400 font-mono border border-white/10">{{ tasks.length }}</span>
                    </h3>
                 </div>
              </div>

              <!-- Task List Container -->
              <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <transition-group name="list" tag="div" class="space-y-3">
                  <div
                    v-for="(task, index) in tasks"
                    :key="task.id"
                    :draggable="true"
                    @dragstart="onDragStart($event, index)"
                    @drop="onDrop($event, index)"
                    @dragover.prevent
                    @dragend="onDragEnd"
                    class="task-row group relative"
                    :class="[
                      getTaskClasses(task),
                      { 'opacity-50 blur-sm scale-95': isDragging && dragIndex === index }
                    ]"
                  >
                     <!-- Status Indicator Stripe -->
                     <div class="absolute left-0 top-0 bottom-0 w-1 bg-gray-600 transition-colors duration-300"
                          :class="{
                            'bg-green-500': task.completed,
                            'bg-red-500': !task.completed && isOverdue(task),
                            'bg-yellow-500': !task.completed && isUrgent(task) && !isOverdue(task),
                            'bg-cyan-500': !task.completed && !isOverdue(task) && !isUrgent(task)
                          }"></div>

                     <div class="p-4 pl-6 flex items-start gap-4">
                        <!-- Checkbox -->
                        <button 
                          @click="toggleTask(task)"
                          class="mt-1 w-5 h-5 rounded border border-white/20 flex items-center justify-center transition-all hover:border-cyan-400"
                          :class="task.completed ? 'bg-green-500 border-green-500' : 'bg-transparent'"
                        >
                           <svg v-if="task.completed" class="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                        </button>

                        <!-- Content -->
                        <div class="flex-1 min-w-0">
                           <div class="flex items-center gap-3 mb-1">
                              <h4 
                                class="text-base font-semibold text-gray-100 truncate cursor-pointer hover:text-cyan-300 transition-colors"
                                :class="{'line-through text-gray-500': task.completed}"
                                @click="toggleExpand(task.id)"
                              >
                                {{ task.title }}
                              </h4>
                              <span class="px-1.5 py-0.5 rounded text-[10px] font-mono border" 
                                    :class="{
                                      'border-red-500 text-red-400 bg-red-500/10': task.plan === 'A',
                                      'border-yellow-500 text-yellow-400 bg-yellow-500/10': task.plan === 'B',
                                      'border-blue-500 text-blue-400 bg-blue-500/10': task.plan === 'C'
                                    }">
                                {{ task.plan }}
                              </span>
                           </div>
                           
                           <p v-if="task.description && (isExpanded(task.id) || tasks.length < 5)" 
                              class="text-sm text-gray-400 line-clamp-2 max-w-[90%]"
                              :class="{'line-through text-gray-600': task.completed}">
                              {{ task.description }}
                           </p>
                           
                           <div class="flex items-center gap-4 mt-2 text-xs text-gray-500 font-mono">
                              <span v-if="task.deadline" class="flex items-center gap-1" :class="getDeadlineClass(task)">
                                 <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                 {{ formatDate(task.deadline) }}
                              </span>
                           </div>
                        </div>

                        <!-- Right Actions -->
                        <div class="flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <div class="flex items-center bg-gray-900/50 rounded-lg p-1 border border-white/5">
                              <button @click="editTask(task)" class="p-1.5 hover:text-cyan-400 transition-colors" title="Edit">
                                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                              </button>
                              <button @click="archiveTask(task.id)" class="p-1.5 hover:text-yellow-400 transition-colors" title="Archive">
                                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                              </button>
                              <button @click="deleteTask(task.id)" class="p-1.5 hover:text-red-400 transition-colors" title="Delete">
                                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              </button>
                           </div>
                           
                           <!-- Mining/Points Button -->
                           <button 
                              @click.stop="incrementMiningPoints(task)"
                              class="text-[10px] font-mono border border-cyan-500/30 bg-cyan-950/30 px-2 py-1 rounded text-cyan-300 hover:bg-cyan-500/20 transition-all flex items-center gap-1"
                           >
                              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path></svg>
                              {{ task.miningPoints || 0 }} PTS
                           </button>
                        </div>
                     </div>
                  </div>
                </transition-group>

                <!-- Empty State -->
                <div v-if="tasks.length === 0" class="h-64 flex flex-col items-center justify-center text-center opacity-60">
                   <div class="w-20 h-20 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center mb-4 animate-spin-slow">
                      <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                   </div>
                   <p class="text-gray-400 font-mono text-sm">NO ACTIVE DIRECTIVES</p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </main>

    <!-- Modals Overlay -->
    <transition name="fade">
      <div v-if="editingTask || showDeleteConfirm" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        
        <!-- Logic for Delete Modal -->
        <div v-if="showDeleteConfirm" class="neo-card p-6 max-w-sm w-full border-red-500/30 shadow-red-900/20">
          <h3 class="text-xl font-bold text-red-400 mb-2">CRITICAL WARNING</h3>
          <p class="text-gray-300 text-sm mb-6">Permanent deletion of protocol requested. This action is irreversible.</p>
          <div class="flex justify-end gap-3">
            <button @click="cancelDelete" class="px-4 py-2 rounded border border-gray-600 hover:bg-gray-800 text-gray-300 text-sm">ABORT</button>
            <button @click="performDelete" class="px-4 py-2 rounded bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 text-sm font-bold">CONFIRM DELETION</button>
          </div>
        </div>

        <!-- Logic for Edit Modal -->
        <div v-if="editingTask" class="neo-card p-6 max-w-lg w-full">
           <div class="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h3 class="text-xl font-bold text-white">MODIFY PROTOCOL</h3>
              <button @click="cancelEdit" class="text-gray-500 hover:text-white">&times;</button>
           </div>
           
           <form @submit.prevent="saveTaskEdit" class="space-y-4">
              <div class="group">
                <label class="text-[10px] uppercase tracking-wider text-cyan-500/80 mb-1 block">Title</label>
                <input v-model="editingTask.title" class="neo-input" />
              </div>
              
              <div class="group">
                <label class="text-[10px] uppercase tracking-wider text-cyan-500/80 mb-1 block">Description</label>
                <textarea v-model="editingTask.description" rows="4" class="neo-input resize-none"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                 <select v-model="editingTask.plan" class="neo-input">
                    <option value="A">Priority Alpha</option>
                    <option value="B">Priority Beta</option>
                    <option value="C">Priority Gamma</option>
                 </select>
                 <input type="date" v-model="editingTask.deadline" class="neo-input" />
              </div>

              <div class="flex justify-end gap-3 mt-6">
                 <button type="button" @click="cancelEdit" class="px-4 py-2 rounded border border-gray-600 hover:bg-gray-800 text-gray-300 text-sm">CANCEL</button>
                 <button type="submit" class="neo-btn px-6">SAVE CHANGES</button>
              </div>
           </form>
        </div>

      </div>
    </transition>

    <!-- Footer Controls -->
    <footer class="fixed bottom-0 left-0 w-full p-4 z-50 pointer-events-none">
       <div class="flex justify-center gap-4 pointer-events-auto">
          <button @click="backToCollection" class="glass-pill">
             <span class="opacity-50">↩</span> COLLECTION
          </button>
          <button @click="viewArchivedTasks" class="glass-pill">
             ARCHIVE_LOGS
          </button>
          <button @click="sendMarkedToArchive" class="glass-pill text-cyan-300 border-cyan-500/30">
             COMPLETE_MISSION
          </button>
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

export default {
  name: 'TskView',
  components: {
    UniversalBanner
  },
  props: {
    mouseX: {
      type: Number,
      default: 0
    },
    mouseY: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tasks: [],
      isDragging: false,
      dragIndex: null,
      editingTask: null,
      showDeleteConfirm: false,
      pendingDeleteId: null,
      expandedTaskIds: [],
      form: {
        title: '',
        plan: 'A',
        description: '',
        deadline: ''
      }
    };
  },
  computed: {
    totalMiningPoints() {
      return this.tasks.reduce((sum, task) => sum + (task.miningPoints || 0), 0);
    },
    contentParallaxStyle() {
      if (typeof window !== 'undefined' && window.innerWidth < 768) return {};
      // Subtle float for content container based on mouse
      const x = this.mouseX * 0.05 * 50;
      const y = this.mouseY * 0.05 * 50;
      return {
        transform: `translate(${x}px, ${y}px)`
      };
    }
  },
  mounted() {
    this.loadTasks();
  },
  methods: {
    loadTasks() {
      if (!auth.currentUser) return;
      
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

        await addDoc(collection(db, 'tasks'), newTask);
        
        this.form.title = '';
        this.form.description = '';
        this.form.plan = 'A';
        this.form.deadline = '';
      } catch (error) {
        console.error('Error adding task:', error);
      }
    },

    async toggleTask(task) {
        await updateDoc(doc(db, 'tasks', task.id), {
          completed: !task.completed,
          updatedAt: serverTimestamp(),
          ...(task.completed ? {} : { completedAt: serverTimestamp() })
        });
    },

    deleteTask(taskId) {
      this.pendingDeleteId = taskId;
      this.showDeleteConfirm = true;
    },

    async performDelete() {
      if (this.pendingDeleteId) {
        await deleteDoc(doc(db, 'tasks', this.pendingDeleteId));
        this.showDeleteConfirm = false;
        this.pendingDeleteId = null;
      }
    },

    cancelDelete() {
      this.showDeleteConfirm = false;
      this.pendingDeleteId = null;
    },

    async archiveTask(taskId) {
      await updateDoc(doc(db, 'tasks', taskId), {
        archived: true,
        updatedAt: serverTimestamp()
      });
    },

    editTask(task) {
      this.editingTask = { ...task };
    },

    async saveTaskEdit() {
      if (!this.editingTask) return;
      await updateDoc(doc(db, 'tasks', this.editingTask.id), {
        title: this.editingTask.title.trim(),
        description: this.editingTask.description,
        plan: this.editingTask.plan,
        deadline: this.editingTask.deadline || null,
        updatedAt: serverTimestamp()
      });
      this.editingTask = null;
    },

    cancelEdit() {
      this.editingTask = null;
    },

    async incrementMiningPoints(task) {
      await updateDoc(doc(db, 'tasks', task.id), {
        miningPoints: (task.miningPoints || 0) + 1,
        updatedAt: serverTimestamp()
      });
    },

    // View Helpers
    formatDate(dateStr) {
       if (!dateStr) return '';
       const date = new Date(dateStr);
       return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },
    isUrgent(task) { return this.getDeadlineClass(task) === 'text-yellow-400'; },
    isOverdue(task) { return this.getDeadlineClass(task) === 'text-red-400'; },
    
    getDeadlineClass(task) {
        if (!task.deadline) return 'text-gray-500';
        const now = new Date();
        now.setHours(0,0,0,0);
        const [y, m, d] = task.deadline.split('-').map(Number);
        const deadline = new Date(y, m-1, d);
        
        if (deadline < now) return 'text-red-400'; // Overdue
        const diff = (deadline - now) / (1000 * 60 * 60 * 24);
        if (diff <= 2) return 'text-yellow-400'; // Urgent
        return 'text-cyan-400';
    },
    
    toggleExpand(id) {
       const idx = this.expandedTaskIds.indexOf(id);
       if (idx === -1) this.expandedTaskIds.push(id);
       else this.expandedTaskIds.splice(idx, 1);
    },
    isExpanded(id) { return this.expandedTaskIds.includes(id); },
    getTaskClasses(task) {
       if (task.completed) return 'opacity-60 grayscale';
       return '';
    },

    // Drag Drop
    onDragStart(e, index) { 
       this.dragIndex = index; 
       this.isDragging = true; 
    },
    onDrop(e, dropIndex) {
       if (this.dragIndex === null || this.dragIndex === dropIndex) return;
       const item = this.tasks[this.dragIndex];
       this.tasks.splice(this.dragIndex, 1);
       this.tasks.splice(dropIndex, 0, item);
       this.dragIndex = dropIndex; // Update for visual consistency
       this.updateTaskOrders();
    },
    onDragEnd() { 
       this.isDragging = false; 
       this.dragIndex = null; 
    },
    async updateTaskOrders() {
       const updates = this.tasks.map((t, i) => updateDoc(doc(db, 'tasks', t.id), { order: i }));
       await Promise.all(updates);
    },

    // Navigation
    viewArchivedTasks() { this.$router.push('/archive'); },
    backToCollection() { this.$router.push('/'); },
    sendMarkedToArchive() {
       const marked = this.tasks.filter(t => t.completed);
       if (!marked.length) return alert('No completed tasks to archive.');
       if (!confirm(`Archive ${marked.length} tasks?`)) return;
       marked.forEach(t => this.archiveTask(t.id));
    }
  }
};
</script>

<style scoped>
/* MAIN CONTAINER & BACKGROUND */
.cyber-container {
  min-height: 100vh;
  /* background-color: #050510; removed to show global App background */
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  color: #e2e8f0;
}

.parallax-layer {
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  pointer-events: none;
  transition: transform 0.1s linear;
}

/* STARS */
.stars {
  background-image: 
    radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 40px 70px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 90px 40px, #ffffff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 160px 120px, #ffffff, rgba(0,0,0,0));
  background-size: 200px 200px;
  opacity: 0.3;
}

/* GRID HORIZON */
.grid-horizon {
  background: 
    linear-gradient(transparent 0%, rgba(0, 243, 255, 0.1) 1%, transparent 2%),
    linear-gradient(90deg, transparent 0%, rgba(0, 243, 255, 0.1) 1%, transparent 2%);
  background-size: 50px 50px;
  transform: perspective(500px) rotateX(60deg) translateY(0) translateZ(-200px);
  transform-origin: center 80%;
  opacity: 0.2;
  bottom: -50%;
  height: 100%;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% { background-position: 0 0; }
  100% { background-position: 0 500px; }
}

/* NEBULA GLOW */
.nebula-glow {
  background: 
    radial-gradient(circle at 20% 30%, rgba(157, 0, 255, 0.15), transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(0, 243, 255, 0.1), transparent 40%);
  filter: blur(40px);
}

/* UI COMPONENTS: NEO GLASS */
.neo-card {
  background: rgba(10, 15, 30, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.5), 
    0 2px 4px -1px rgba(0, 0, 0, 0.3),
    inset 0 0 20px rgba(0, 243, 255, 0.03);
  transition: all 0.3s ease;
}

.neo-card:hover {
  border-color: rgba(0, 243, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 243, 255, 0.1);
}

.neo-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px 14px;
  color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.neo-input:focus {
  outline: none;
  border-color: #00f3ff;
  box-shadow: 0 0 0 2px rgba(0, 243, 255, 0.2);
  background: rgba(0, 0, 0, 0.5);
}

.neo-btn {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.glass-pill {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 8px 16px;
    border-radius: 99px;
    font-size: 0.75rem;
    color: #fff;
    backdrop-filter: blur(10px);
    transition: all 0.2s;
    font-family: monospace;
}
.glass-pill:hover {
    background: rgba(255,255,255,0.1);
    transform: translateY(-2px);
}

/* LIST ITEM */
.task-row {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 8px;
  overflow: hidden; /* For the status stripe */
  transition: transform 0.2s, background 0.2s;
}
.task-row:hover {
  background: rgba(255,255,255,0.07);
  transform: translateX(4px);
}

/* SCROLLBAR */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.1);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.2);
}

/* ANIMATIONS */
.list-enter-active, .list-leave-active {
  transition: all 0.4s ease;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.animate-spin-slow {
    animation: spin 3s linear infinite;
}
@keyframes spin { from {transform:rotate(0deg);} to {transform:rotate(360deg);} }

</style>