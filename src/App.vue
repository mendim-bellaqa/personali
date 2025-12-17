<!-- src/App.vue -->
<template>
  <div id="app" class="min-h-screen bg-gray-900 text-white font-sans antialiased selection:bg-blue-500/20">
    <!-- Night Village Background -->
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-b from-gray-900 via-[#0B1026] to-[#0B1026]">
      <!-- Stars Layer -->
      <div class="stars absolute inset-0 opacity-80"></div>
      <div class="stars2 absolute inset-0 opacity-60"></div>
      
      <!-- Moon -->
      <div class="absolute top-10 right-10 w-24 h-24 md:w-32 md:h-32 opacity-90 drop-shadow-[0_0_15px_rgba(255,255,200,0.3)] animate-float-slow">
        <img src="@/assets/moon.png" alt="Moon" class="w-full h-full object-contain mix-blend-screen" />
      </div>

      <!-- Village Silhouette -->
      <div class="absolute bottom-0 left-0 w-[100vw] h-[100vh]">
        <img src="@/assets/night-village.png" alt="Night Village" class="w-full h-full object-cover object-bottom opacity-90" />
      </div>
      
      <!-- Gradient Overlay for smooth blending -->
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent z-20"></div>
    </div>

    <!-- Main Content -->
    <main class="relative z-10 pb-20 md:pb-0">
      <transition name="fade" mode="out-in">
        <router-view @login="onLogin" />
      </transition>
    </main>

    <!-- Mobile Bottom Navigation -->
    <BottomNav class="md:hidden" />
  </div>
</template>

<script>
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './services/firebase';
import { addDoc, collection } from 'firebase/firestore';
import BottomNav from './components/BottomNav.vue';

export default {
  name: 'AppRoot',
  components: { BottomNav },
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

<style>
/* Global Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Starry Night Animations */
.stars {
  background-image: 
    radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 50px 160px, #ddd, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 90px 40px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 130px 80px, #fff, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 160px 120px, #ddd, rgba(0,0,0,0));
  background-repeat: repeat;
  background-size: 200px 200px;
  animation: twinkle 5s infinite linear;
}

.stars2 {
  background-image: 
    radial-gradient(2px 2px at 100px 150px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 200px 50px, #fff, rgba(0,0,0,0)),
    radial-gradient(2px 2px at 300px 100px, #eee, rgba(0,0,0,0));
  background-repeat: repeat;
  background-size: 300px 300px;
  animation: moveStars 100s linear infinite;
}

@keyframes twinkle {
  0% { opacity: 0.8; }
  50% { opacity: 0.5; }
  100% { opacity: 0.8; }
}

@keyframes moveStars {
  from { transform: translateY(0); }
  to { transform: translateY(-300px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
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