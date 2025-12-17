<template>
  <div class="max-w-md mx-auto bg-white/5 p-6 rounded-lg shadow-lg backdrop-blur">
    
    <!-- Header -->
    <h2 class="text-2xl font-bold mb-4 text-white">
      {{ forgotPasswordMode ? 'Reset Password' : 'Welcome back' }}
    </h2>
    
    <!-- Forgot Password Form -->
    <form v-if="forgotPasswordMode" @submit.prevent="resetPassword" class="space-y-4">
      <p class="text-sm text-gray-300 mb-4">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      <div>
        <label class="block text-sm text-gray-300">Email address</label>
        <input 
          v-model="resetEmail" 
          type="email"
          required
          class="w-full p-3 rounded-lg bg-black/20 text-white border border-white/20 focus:border-blue-400 focus:outline-none transition-colors"
          placeholder="email@example.com"
        />
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full px-4 py-3 liquid-glass rounded-lg font-medium disabled:opacity-50"
      >
        <span v-if="loading">Sending link...</span>
        <span v-else>Send Reset Link</span>
      </button>

      <div class="text-center mt-4">
        <button 
          type="button" 
          @click="forgotPasswordMode = false; message = ''" 
          class="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Cancel and go back to login
        </button>
      </div>
    </form>

    <!-- Login Form -->
    <div v-else>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm text-gray-300">Email or username</label>
          <input 
            v-model="identifier" 
            type="text"
            required
            class="w-full p-3 rounded-lg bg-black/20 text-white border border-white/20 focus:border-blue-400 focus:outline-none transition-colors"
            placeholder="email@example.com or username"
          />
        </div>

        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="block text-sm text-gray-300">Password</label>
            <button 
              type="button" 
              @click="forgotPasswordMode = true; message = ''" 
              class="text-xs text-blue-400 hover:text-blue-300"
            >
              Forgot password?
            </button>
          </div>
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
        class="w-full px-4 py-3 liquid-glass rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
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
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default {
  name: 'AuthLogin',
  data() {
    return {
      identifier: '', // email or username
      password: '',
      resetEmail: '',
      forgotPasswordMode: false,
      loading: false,
      message: '',
      messageType: 'info'
    };
  },
  methods: {
    async resetPassword() {
      if (!this.resetEmail) {
        this.showMessage('Please enter your email address.', 'error');
        return;
      }
      
      this.loading = true;
      this.message = '';
      
      try {
        await sendPasswordResetEmail(auth, this.resetEmail);
        this.showMessage('Password reset link sent! Check your inbox.', 'success');
        this.resetEmail = ''; // Clear input
        // Optional: switch back to login after short delay
        setTimeout(() => {
          this.forgotPasswordMode = false;
        }, 3000);
      } catch (error) {
        console.error('Reset password error:', error);
        let errorMessage = 'Failed to send reset email.';
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'No user found with this email address.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address.';
        }
        this.showMessage(errorMessage, 'error');
      } finally {
        this.loading = false;
      }
    },

    async login() {
      // Basic validation
      if (!this.identifier || !this.password) {
        this.showMessage('Please enter both email/username and password', 'error');
        return;
      }

      this.loading = true;
      this.message = '';

      // detect email vs username
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let emailToUse = null;

      try {
        if (emailRegex.test(this.identifier.trim())) {
          // user entered an email
          emailToUse = this.identifier.trim();
        } else {
          // treat as username — lookup in users collection
          const q = query(collection(db, 'users'), where('displayName', '==', this.identifier.trim()));
          const snap = await getDocs(q);
          if (snap.empty) {
            this.showMessage('Username not found. Please create an account.', 'error');
            this.loading = false;
            return;
          }
          // pick first matching user (if duplicates exist)
          const userDoc = snap.docs[0];
          const data = userDoc.data();
          if (!data.email) {
            this.showMessage('User record has no email. Please contact support.', 'error');
            this.loading = false;
            return;
          }
          emailToUse = data.email;
        }

        console.log('Attempting to sign in with email:', emailToUse);
        const userCredential = await signInWithEmailAndPassword(auth, emailToUse, this.password);
        console.log('Login successful:', userCredential.user.uid);

        // Ensure a users/{uid} doc exists (useful if accounts were created before client-side writes were added)
        try {
          const uref = doc(db, 'users', userCredential.user.uid);
          const ud = await getDoc(uref);
          if (!ud.exists()) {
            await setDoc(uref, {
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              displayName: userCredential.user.displayName || '',
              provider: 'password',
              createdAt: serverTimestamp(),
              emailVerified: userCredential.user.emailVerified || false
            }, { merge: true });
          }
        } catch (e) {
          console.warn('Failed to ensure users doc exists:', e);
        }

        this.showMessage('Successfully signed in!', 'success');
        // Wait a moment then emit login event
        setTimeout(() => {
          this.$emit('login', userCredential.user);
        }, 800);

      } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed';
        // If the error is from Firebase Auth, map known codes
        if (error && error.code) {
          switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/invalid-credential':
              errorMessage = 'Incorrect email or password.';
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
              errorMessage = error.message || String(error);
          }
        } else {
          errorMessage = error.message || String(error);
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
        // Force account selection to avoid auto-sign-in loops with wrong accounts
        provider.setCustomParameters({
          prompt: 'select_account'
        });
        
        const result = await signInWithPopup(auth, provider);
        console.log('Google login successful:', result.user.uid);

        // Ensure users/{uid} exists for Google sign-ins too
        try {
          const uref = doc(db, 'users', result.user.uid);
          const ud = await getDoc(uref);
          if (!ud.exists()) {
            await setDoc(uref, {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName || '',
              provider: 'google',
              createdAt: serverTimestamp(),
              emailVerified: result.user.emailVerified || false
            }, { merge: true });
          }
        } catch (e) {
          console.warn('Failed to ensure users doc exists for Google user:', e);
        }

        this.showMessage('Successfully signed in with Google!', 'success');
        
        // Wait a moment then emit login event
        setTimeout(() => {
          this.$emit('login', result.user);
        }, 1000);

      } catch (error) {
        console.error('Google login error:', error);
        
        let errorMessage = 'Google login failed';
        if (error.code === 'auth/popup-closed-by-user') {
          errorMessage = 'Login cancelled.';
        } else if (error.code === 'auth/popup-blocked') {
          errorMessage = 'Popup blocked. Please allow popups for this site.';
        } else if (error.code === 'auth/operation-not-allowed') {
          errorMessage = 'Google Sign-In is not enabled. Please contact administrator.';
        } else if (error.message) {
          errorMessage = error.message;
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
