<template>
  <div class="tsk-container relative w-full h-screen flex flex-col overflow-hidden text-white font-sans">
    <UniversalBanner />

    <!-- BOX LETTERS HEADER / TASK INPUT -->
    <header class="relative z-50 pt-16 w-full max-w-2xl px-6 mx-auto flex flex-col items-center">
      <div class="flex justify-center mb-6">
        <div class="flex gap-2">
          <div v-for="char in 'TSK'" :key="char" class="box-letter">
            {{ char }}
          </div>
        </div>
      </div>

      <div class="box-task-input group relative w-full mb-8">
        <div class="absolute inset-0 bg-blue-500/10 blur-xl group-focus-within:bg-blue-500/20 transition-all"></div>
        <div class="relative flex items-center bg-black/40 border-2 border-white/10 rounded-2xl p-2 transition-all group-focus-within:border-white/30 backdrop-blur-xl">
          <input 
            v-model="form.title" 
            @keyup.enter="addTask"
            placeholder="ADD NEW DIRECTIVE..." 
            class="flex-1 bg-transparent border-none outline-none px-4 py-3 text-lg font-bold tracking-widest placeholder:text-white/20"
          />
          <button @click="addTask" class="bg-white text-black font-black px-6 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all">
            +
          </button>
        </div>
      </div>
    </header>

    <!-- TASK FIELD (BIG MOVABLE AREA) -->
    <main 
      ref="field"
      class="flex-1 relative cursor-crosshair m-4 mb-24 overflow-hidden"
      @mousedown.self="startPan"
      @mousemove="onMouseMove"
      @mouseup="stopInteraction"
      @mouseleave="stopInteraction"
    >
      <!-- Task Field Background Grid -->
      <div class="absolute inset-0 opacity-10 pointer-events-none" :style="backgroundStyle"></div>

      <!-- Draggable Tasks -->
      <div 
        v-for="(task, index) in tasks" 
        :key="task.id"
        class="absolute cursor-grab active:cursor-grabbing transition-transform"
        :style="getTaskStyle(task)"
        @mousedown.stop="startDragTask($event, task)"
      >
        <div 
          class="task-box group"
          :class="{'completed': task.completed, 'dragging': draggingTaskId === task.id}"
        >
          <!-- Task Content -->
          <div class="relative z-10 p-5 min-w-[200px] max-w-[300px]">
            <div class="flex justify-between items-start mb-2">
              <span class="text-[10px] font-black opacity-30 tracking-[0.2em] uppercase">Protocol #{{ index + 1 }}</span>
              <button @click.stop="toggleTask(task)" class="w-4 h-4 rounded-sm border border-white/20 flex items-center justify-center hover:border-white transition-colors">
                <svg v-if="task.completed" class="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
              </button>
            </div>
            
            <h3 class="font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors" :class="{'line-through opacity-50': task.completed}">
              {{ task.title }}
            </h3>
            <p v-if="task.description" class="text-xs text-white/40 line-clamp-2 mb-4">{{ task.description }}</p>

            <div class="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="text-[10px] text-white/20 font-mono">{{ formatDate(task.createdAt) }}</span>
              <button @click.stop="deleteTask(task.id)" class="text-red-500/50 hover:text-red-500 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>

          <!-- Glass Effect & Border -->
          <div class="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-white/20 shadow-2xl transition-all"></div>
          <div class="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-[20px] blur-lg"></div>
        </div>
      </div>
    </main>

    <!-- FOOTER NAV -->
    <footer class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 p-2 bg-black/40 border border-white/10 rounded-full backdrop-blur-2xl">
      <button @click="backToCollection" class="px-6 py-2 rounded-full hover:bg-white/10 transition-colors text-xs font-bold tracking-widest uppercase">
        Collection
      </button>
      <div class="w-px h-4 bg-white/10"></div>
      <div class="px-6 py-2 text-xs font-bold tracking-widest uppercase text-white/30">
        {{ tasks.length }} Tasks Active
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
import { auth, db } from '../services/firebase';
import UniversalBanner from '../components/UniversalBanner.vue';

export default {
  name: 'TskView',
  components: { UniversalBanner },
  data() {
    return {
      tasks: [],
      form: { title: '' },
      draggingTaskId: null,
      offset: { x: 0, y: 0 },
      pan: { x: 0, y: 0 },
      isPanning: false,
      physicsLoop: null,
      repulsionStrength: 50,
      repulsionRadius: 250,
      damping: 0.9,
      fieldBounds: { width: 4000, height: 4000 } // Large virtual canvas
    };
  },
  computed: {
    backgroundStyle() {
      return {
        backgroundPosition: `${this.pan.x}px ${this.pan.y}px`,
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      };
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
            x: data.x ?? (Math.random() - 0.5) * 1000,
            y: data.y ?? (Math.random() - 0.5) * 1000,
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

    async addTask() {
      if (!this.form.title.trim() || !auth.currentUser) return;
      const newTask = {
        title: this.form.title,
        completed: false,
        archived: false,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
        x: -this.pan.x + (Math.random() - 0.5) * 100,
        y: -this.pan.y + (Math.random() - 0.5) * 100,
        vx: 0,
        vy: 0
      };
      await addDoc(collection(db, 'tasks'), newTask);
      this.form.title = '';
    },

    async toggleTask(task) {
      await updateDoc(doc(db, 'tasks', task.id), { completed: !task.completed });
    },

    async deleteTask(taskId) {
      await deleteDoc(doc(db, 'tasks', taskId));
    },

    startPhysics() {
      const update = () => {
        // 1. Calculate Field Dimensions for boundaries
        const fieldRect = this.$refs.field?.getBoundingClientRect() || { width: 0, height: 0 };
        const h = fieldRect.height;
        const w = fieldRect.width;

        // 2. Inter-task repulsion
        for (let i = 0; i < this.tasks.length; i++) {
          for (let j = i + 1; j < this.tasks.length; j++) {
            const t1 = this.tasks[i];
            const t2 = this.tasks[j];
            
            const dx = t1.x - t2.x;
            const dy = t1.y - t2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < this.repulsionRadius && dist > 0) {
              const force = (this.repulsionRadius - dist) / this.repulsionRadius;
              const fx = (dx / dist) * force * this.repulsionStrength;
              const fy = (dy / dist) * force * this.repulsionStrength;
              
              if (t1.id !== this.draggingTaskId) {
                t1.vx += fx;
                t1.vy += fy;
              }
              if (t2.id !== this.draggingTaskId) {
                t2.vx -= fx;
                t2.vy -= fy;
              }
            }
          }
        }

        // 3. Apply velocity and Barrier Physics
        this.tasks.forEach(task => {
          if (task.id === this.draggingTaskId) return;
          
          task.x += task.vx;
          task.y += task.vy;
          task.vx *= this.damping;
          task.vy *= this.damping;
          
          // INVISIBLE BOUNCE BOUNDARIES (Ping-pong effect)
          const halfW = 150; // Approximated card dimensions
          const halfH = 80;

          // TOP BARRIER (The "Under Directive" Line)
          if (task.y + this.pan.y - halfH < -h / 2) {
              task.y = -h / 2 - this.pan.y + halfH;
              task.vy = Math.abs(task.vy) * 0.6; // Bounce back down
          }
          // BOTTOM BARRIER
          if (task.y + this.pan.y + halfH > h / 2) {
              task.y = h / 2 - this.pan.y - halfH;
              task.vy = -Math.abs(task.vy) * 0.6; // Bounce back up
          }
          // LEFT BARRIER
          if (task.x + this.pan.x - halfW < -w / 2) {
              task.x = -w / 2 - this.pan.x + halfW;
              task.vx = Math.abs(task.vx) * 0.6; // Bounce right
          }
          // RIGHT BARRIER
          if (task.x + this.pan.x + halfW > w / 2) {
              task.x = w / 2 - this.pan.x - halfW;
              task.vx = -Math.abs(task.vx) * 0.6; // Bounce left
          }
        });

        this.physicsLoop = requestAnimationFrame(update);
      };
      this.physicsLoop = requestAnimationFrame(update);
    },

    startDragTask(e, task) {
      this.draggingTaskId = task.id;
      const rect = this.$refs.field.getBoundingClientRect();
      this.offset = {
        x: e.clientX - rect.left - (task.x + this.pan.x + rect.width / 2),
        y: e.clientY - rect.top - (task.y + this.pan.y + rect.height / 2)
      };
    },

    startPan(e) {
      this.isPanning = true;
      this.offset = {
        x: e.clientX - this.pan.x,
        y: e.clientY - this.pan.y
      };
    },

    onMouseMove(e) {
      const rect = this.$refs.field.getBoundingClientRect();
      if (this.draggingTaskId) {
        const task = this.tasks.find(t => t.id === this.draggingTaskId);
        if (task) {
          task.x = e.clientX - rect.left - this.offset.x - this.pan.x - rect.width / 2;
          task.y = e.clientY - rect.top - this.offset.y - this.pan.y - rect.height / 2;
          task.vx = 0;
          task.vy = 0;
        }
      } else if (this.isPanning) {
        this.pan.x = e.clientX - this.offset.x;
        this.pan.y = e.clientY - this.offset.y;
      }
    },

    async stopInteraction() {
      if (this.draggingTaskId) {
        const task = this.tasks.find(t => t.id === this.draggingTaskId);
        if (task) {
          await updateDoc(doc(db, 'tasks', task.id), { x: task.x, y: task.y });
        }
        this.draggingTaskId = null;
      }
      this.isPanning = false;
    },

    getTaskStyle(task) {
      return {
        left: '50%',
        top: '50%',
        transform: `translate(${task.x + this.pan.x - 150}px, ${task.y + this.pan.y - 100}px)`,
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

.box-letter {
  width: 60px;
  height: 60px;
  background: white;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 900;
  border-radius: 12px;
  box-shadow: 0 10px 0 #cbd5e1;
  transform: rotate(-3deg);
  transition: all 0.3s;
}

.box-letter:hover {
  transform: translateY(-5px) rotate(0deg);
  box-shadow: 0 15px 0 #cbd5e1;
}

.box-letter:nth-child(even) {
  transform: rotate(3deg);
}

.task-box {
  transition: transform 0.1s ease-out;
}

.task-box.dragging {
  transform: scale(1.05);
}

.task-box.completed .absolute.inset-0 {
  background: rgba(34, 197, 94, 0.05);
  border-color: rgba(34, 197, 94, 0.2);
}

/* Custom Scrollbar for hidden feel */
* {
  user-select: none;
  -webkit-user-drag: none;
}
</style>