<template>
  <div class="max-w-md mx-auto bg-white/5 p-6 rounded-lg shadow-lg backdrop-blur">
    <h2 class="text-2xl font-bold mb-4 text-white">Create account</h2>
    
    <form @submit.prevent="register" class="space-y-4">
      <div>
        <label class="block text-sm text-gray-300">Username</label>
        <input 
          v-model="username" 
          type="text"
          required
          class="w-full p-3 rounded-lg bg-black/20 text-white border border-white/20 focus:border-blue-400 focus:outline-none transition-colors"
          placeholder="Choose a username"
        />
      </div>

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
          minlength="6"
          class="w-full p-3 rounded-lg bg-black/20 text-white border border-white/20 focus:border-blue-400 focus:outline-none transition-colors"
          placeholder="At least 6 characters"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-300">Confirm Password</label>
        <input 
          v-model="passwordConfirm" 
          type="password"
          required
          class="w-full p-3 rounded-lg bg-black/20 text-white border border-white/20 focus:border-blue-400 focus:outline-none transition-colors"
          placeholder="Confirm your password"
        />
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full px-4 py-3 liquid-glass rounded-lg font-medium disabled:opacity-50"
      >
        <span v-if="loading">Creating Account...</span>
        <span v-else>Create Account</span>
      </button>
    </form>

    <!-- Divider -->
    <div class="my-6 flex items-center">
      <div class="flex-1 border-t border-white/20"></div>
      <span class="px-4 text-sm text-gray-400">or</span>
      <div class="flex-1 border-t border-white/20"></div>
    </div>

    <!-- Google Sign Up -->
    <button 
      @click="registerWithGoogle"
      :disabled="loading"
      class="w-full px-4 py-3 liquid-glass rounded-lg font-medium disabled:opacity-50"
    >
      Sign up with Google
    </button>

    <div class="mt-6 text-center">
      <p class="text-sm text-gray-300">
        Already have an account?
        <router-link to="/login" class="text-blue-400 hover:text-blue-300 transition-colors">
          Sign in
        </router-link>
      </p>
    </div>

    <!-- Error/Success Messages -->
    <div v-if="message" :class="['mt-4 p-3 rounded-lg text-sm', messageType === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300']">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../services/firebase';

export default {
  name: 'AuthRegister',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      loading: false,
      message: '',
      messageType: 'info'
    };
  },
  methods: {
    async register() {
      // Validation
      if (!this.username || !this.email || !this.password) {
        this.showMessage('Please fill in all fields', 'error');
        return;
      }

      if (this.password !== this.passwordConfirm) {
        this.showMessage('Passwords do not match', 'error');
        return;
      }

      if (this.password.length < 6) {
        this.showMessage('Password must be at least 6 characters long', 'error');
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
        console.log('Attempting to create account...');
        
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        console.log('User created:', userCredential.user.uid);

        // Update user profile
        await updateProfile(userCredential.user, {
          displayName: this.username
        });
        console.log('Profile updated');

        // Send email verification
        await sendEmailVerification(userCredential.user);
        console.log('Verification email sent');

        this.showMessage('Account created successfully! Please check your email to verify your account.', 'success');
        
        // Clear form
        this.username = '';
        this.email = '';
        this.password = '';
        this.passwordConfirm = '';

        // Sign out the user for email verification flow to avoid navigation conflicts
        await auth.signOut();
        console.log('User signed out for email verification');

        // Wait a moment then redirect to login
        setTimeout(() => {
          this.$router.push('/login?registered=true');
        }, 2000);

      } catch (error) {
        console.error('Registration error:', error);
        
        let errorMessage = 'Registration failed';
        
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'An account with this email already exists. Please try signing in instead.';
            setTimeout(() => {
              this.$router.push('/login');
            }, 2000);
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. Please choose a stronger password.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format.';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Email/password registration is disabled. Please enable it in Firebase Console.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many attempts. Please try again later.';
            break;
          default:
            errorMessage = error.message;
        }

        this.showMessage(errorMessage, 'error');
      } finally {
        this.loading = false;
      }
    },

    async registerWithGoogle() {
      try {
        this.loading = true;
        this.message = '';

        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        console.log('Google registration successful:', result.user.uid);

        // Ensure user is authenticated and redirect
        if (result.user) {
          this.$emit('login', result.user);
          this.$router.push('/');
        } else {
          throw new Error('Google authentication failed.');
        }

      } catch (error) {
        console.error('Google registration error:', error);

        let errorMessage = 'Google registration failed';
        if (error.code === 'auth/popup-closed-by-user') {
          errorMessage = 'Registration cancelled. Please try again.';
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
