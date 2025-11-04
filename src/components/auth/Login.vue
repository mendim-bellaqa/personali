<template>
  <div class="max-w-md mx-auto bg-white/5 p-6 rounded-lg shadow-lg backdrop-blur">
    <h2 class="text-2xl font-bold mb-4 text-white">Welcome back</h2>
    
    <form @submit.prevent="login" class="space-y-4">
      <div>
        <label class="block text-sm text-gray-300">Email</label>
        <input 
          v-model="email" 
          type="email"
          required
          class="w-full p-3 rounded-lg bg-black/20 text-white border border-white/20 focus:border-blue-400 focus:outline-none transition-colors"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-300">Password</label>
        <input 
          v-model="password" 
          type="password"
          required
          class="w-full p-3 rounded-lg bg-black/20 text-white border border-white/20 focus:border-blue-400 focus:outline-none transition-colors"
          placeholder="Your password"
        />
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full px-4 py-3 liquid-glass rounded-lg font-medium disabled:opacity-50"
      >
        <span v-if="loading">Signing in...</span>
        <span v-else>Sign in</span>
      </button>
    </form>

    <!-- Divider -->
    <div class="my-6 flex items-center">
      <div class="flex-1 border-t border-white/20"></div>
      <span class="px-4 text-sm text-gray-400">or</span>
      <div class="flex-1 border-t border-white/20"></div>
    </div>

    <!-- Google Sign In -->
    <button 
      @click="loginWithGoogle"
      :disabled="loading"
      class="w-full px-4 py-3 liquid-glass rounded-lg font-medium disabled:opacity-50"
    >
      Sign in with Google
    </button>

    <div class="mt-6 text-center">
      <p class="text-sm text-gray-300">
        Don't have an account?
        <router-link to="/register" class="text-blue-400 hover:text-blue-300 transition-colors">
          Sign up
        </router-link>
      </p>
    </div>

    <!-- Registration Success Message -->
    <div v-if="$route.query.registered" class="mt-4 p-3 bg-green-500/20 text-green-300 rounded-lg text-sm">
      🎉 Account created successfully! Please sign in with your credentials.
    </div>

    <!-- Error Messages -->
    <div v-if="message" :class="['mt-4 p-3 rounded-lg text-sm', messageType === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300']">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../services/firebase';

export default {
  name: 'AuthLogin',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      message: '',
      messageType: 'info'
    };
  },
  methods: {
    async login() {
      // Basic validation
      if (!this.email || !this.password) {
        this.showMessage('Please enter both email and password', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.showMessage('Please enter a valid email address', 'error');
        return;
      }

      this.loading = true;
      this.message = '';

      try {
        console.log('Attempting to sign in...');
        
        const userCredential = await signInWithEmailAndPassword(auth, this.email.trim(), this.password);
        console.log('Login successful:', userCredential.user.uid);

        this.showMessage('Successfully signed in!', 'success');
        
        // Wait a moment then emit login event
        setTimeout(() => {
          this.$emit('login', userCredential.user);
        }, 1000);

      } catch (error) {
        console.error('Login error:', error);
        
        let errorMessage = 'Login failed';
        
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email. Please check your email or sign up.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/email-not-verified':
            errorMessage = 'Please verify your email address before signing in.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled.';
            break;
          default:
            errorMessage = error.message;
        }

        this.showMessage(errorMessage, 'error');
      } finally {
        this.loading = false;
      }
    },

    async loginWithGoogle() {
      try {
        this.loading = true;
        this.message = '';

        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        console.log('Google login successful:', result.user.uid);

        this.showMessage('Successfully signed in with Google!', 'success');
        
        // Wait a moment then emit login event
        setTimeout(() => {
          this.$emit('login', result.user);
        }, 1000);

      } catch (error) {
        console.error('Google login error:', error);
        
        let errorMessage = 'Google login failed';
        if (error.code === 'auth/popup-closed-by-user') {
          errorMessage = 'Login cancelled. Please try again.';
        }
        
        this.showMessage(errorMessage, 'error');
      } finally {
        this.loading = false;
      }
    },

    showMessage(text, type) {
      this.message = text;
      this.messageType = type;
      
      // Clear message after 10 seconds
      setTimeout(() => {
        this.message = '';
      }, 10000);
    }
  }
};
</script>

<style scoped>
.liquid-glass {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.liquid-glass:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.liquid-glass:disabled {
  cursor: not-allowed;
  transform: none;
}

input:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>
