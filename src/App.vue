<!-- src/App.vue -->
<template>
  <div id="app" class="min-h-screen bg-black text-white">
    <!-- Animated Grid Background -->
    <div class="fixed inset-0 z-0 opacity-20">
      <div class="bg-grid-pattern animate-gridMove"></div>
    </div>

    <!-- Main Content with proper top padding for UniversalBanner -->
    <main class="relative z-10 pt-20">
      <router-view @login="onLogin" />
    </main>
  </div>
</template>

<script>
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './services/firebase';

export default {
  name: 'AppRoot',
  data() {
    return {
      user: null
    }
  },
  created() {
    // Initialize Firebase auth state listener
    onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? `User logged in: ${user.uid}` : 'No user');
      this.user = user;
      
      // If user is authenticated but we're on a public page, redirect appropriately
      if (user && (this.$route.name === 'Login' || this.$route.name === 'Register')) {
        const redirect = this.$route.query.redirect || '/';
        this.$router.replace(redirect);
      }
    });
  },
  methods: {
    onLogin(user) {
      this.user = user;
    },
    async logout() {
      try {
        await auth.signOut();
        this.user = null;
        // Redirect to login if user signs out while on protected route
        const protectedRoutes = ['Tsk', 'PG', 'SC', 'DWN']
        if (protectedRoutes.includes(this.$route.name)) {
          this.$router.replace({ name: 'Login', query: { redirect: this.$route.fullPath } })
        }
      } catch (e) {
        console.warn('Sign out failed:', e);
      }
    },
    async addTask() {
      try {
        if (!this.form.title.trim()) {
          throw new Error('Task title cannot be empty');
        }

        const newTask = {
          title: this.form.title,
          description: this.form.description,
          plan: this.form.plan,
          deadline: this.form.deadline,
          completed: false,
          userId: auth.currentUser.uid // Ensure userId is included
        };

        const docRef = await addDoc(collection(db, 'tasks'), newTask);
        console.log('Task added with ID:', docRef.id);

        this.tasks.push({ id: docRef.id, ...newTask });

        // Clear form
        this.form.title = '';
        this.form.description = '';
        this.form.plan = 'A';
        this.form.deadline = '';
      } catch (error) {
        console.error('Error adding task:', error);
        alert('Failed to add task. Please try again.');
      }
    }
  }
}
</script>

<style scoped>
/* Grid Pattern Background */
.bg-grid-pattern {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 60px 60px;
}

@keyframes gridMove {
  0% { background-position: 0 0; }
  100% { background-position: 60px 60px; }
}

.animate-gridMove {
  animation: gridMove 60s linear infinite;
}

/* Adjust spacing for header and title */
#app main {
  padding-top: 20px; /* Ensure consistent top padding */
}
</style>

{
  "rules": {
    "tasks": {
      ".read": "auth != null",
      ".write": "auth != null && request.auth.uid != null",
      "$taskId": {
        ".read": "auth != null && auth.uid == resource.data.userId",
        ".write": "auth != null && auth.uid == request.resource.data.userId"
      }
    }
  }
}