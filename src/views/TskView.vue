<template>
  <div class="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-4 text-white select-none">
    
    <!-- Animated Grid Background (Identical to other views) -->
    <div class="absolute inset-0 z-0 bg-grid-pattern animate-gridMove"></div>

    <!-- Main Liquid Glass Container (Styled identically to other views) -->
    <div
      class="relative z-10 flex flex-col w-full max-w-md h-[85vh] max-h-[700px] rounded-2xl border border-white/20 border-t-white/30 bg-gradient-to-b from-white/15 to-white/5 p-8 shadow-2xl backdrop-blur-xl"
    >
      <!-- Header -->
      <header class="text-center mb-6 flex-shrink-0">
        <h1 class="text-4xl font-bold text-white">TSK</h1>
        <p class="mt-2 text-gray-300">Your daily checklist.</p>
      </header>

      <!-- Add Task Form -->
      <form @submit.prevent="addTask" class="flex gap-x-2 mb-4 flex-shrink-0">
        <input 
          type="text" 
          v-model="newTaskText"
          placeholder="Add a new task..."
          class="flex-grow bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />
        <button 
          type="submit"
          class="px-5 py-2 rounded-lg border border-green-900/50 border-t-green-400/50 bg-gradient-to-b from-green-500 to-green-600 font-semibold text-white shadow-md transform transition hover:from-green-600 hover:to-green-700 active:scale-95 focus:outline-none"
        >
          Add
        </button>
      </form>

      <!-- Task List (Scrollable) -->
      <div class="flex-grow overflow-y-auto pr-2 -mr-2">
        <ul class="space-y-3">
          <li 
            v-for="task in tasks" 
            :key="task.id"
            class="flex items-center gap-x-3 bg-black/20 p-3 rounded-lg border border-transparent hover:border-white/20 transition group"
          >
            <input 
              type="checkbox"
              v-model="task.completed"
              class="h-5 w-5 rounded bg-white/20 border-white/30 text-pink-400 focus:ring-pink-400 focus:ring-offset-0"
            />
            <span 
              class="flex-grow text-gray-200 transition"
              :class="{ 'line-through text-gray-500': task.completed }"
            >
              {{ task.text }}
            </span>
            <button 
              @click="deleteTask(task.id)"
              class="text-gray-600 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
          <li v-if="tasks.length === 0" class="text-center text-gray-500 py-8">
            All tasks completed. Add a new one!
          </li>
        </ul>
      </div>

      <!-- Footer Controls -->
      <div class="w-full flex justify-between items-center mt-6 pt-4 border-t border-white/10 flex-shrink-0">
        <button
          @click="clearCompletedTasks"
          class="px-4 py-2 rounded-lg border border-red-900/50 border-t-red-400/50 bg-gradient-to-b from-red-600 to-red-700 font-semibold text-white shadow-md transform transition hover:from-red-700 hover:to-red-800 active:scale-95 focus:outline-none text-sm"
        >
          Clear Completed
        </button>
        <router-link to="/" class="text-sm text-blue-400 transition hover:text-blue-300">
          ← Go Back to Collection
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TskView',
  data() {
    return {
      tasks: [
        { id: 1, text: 'Design the new TskView page', completed: true },
        { id: 2, text: 'Implement task functionality', completed: true },
        { id: 3, text: 'Ensure consistent styling', completed: false },
        { id: 4, text: 'Take a well-deserved break', completed: false },
      ],
      newTaskText: '',
      nextTaskId: 5, // Start IDs after the initial ones
    };
  },
  methods: {
    addTask() {
      // Trim whitespace and check if the input is empty
      const trimmedText = this.newTaskText.trim();
      if (!trimmedText) {
        return; // Don't add empty tasks
      }
      
      // Create and add the new task
      this.tasks.unshift({
        id: this.nextTaskId++,
        text: trimmedText,
        completed: false,
      });
      
      // Clear the input field
      this.newTaskText = '';
    },
    deleteTask(taskId) {
      // Filter out the task with the matching ID
      this.tasks = this.tasks.filter(task => task.id !== taskId);
    },
    clearCompletedTasks() {
      // Filter to keep only the tasks that are not completed
      this.tasks = this.tasks.filter(task => !task.completed);
    }
  }
};
</script>

<style scoped>
/* These styles are identical to the previous views and are correct. */

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

/* Custom scrollbar for the task list */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  border: 3px solid transparent;
}
</style>